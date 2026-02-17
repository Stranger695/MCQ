const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for backend logic
const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 3001;

/**
 * IDENTITY MIDDLEWARE
 * Verifies roles for sensitive academic operations
 */
const checkRole = (roles) => async (req, res, next) => {
    const userId = req.headers['x-user-id']; // Simplified for this implementation
    if (!userId) return res.status(401).json({ error: 'Identity required' });

    const { data: user } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied: Insufficient Clearance' });
    }
    next();
};

/**
 * SECURE GRADING ENGINE
 * Logic is executed server-side to prevent student manipulation of scores.
 */
app.post('/api/v1/exams/submit', async (req, res) => {
    const { studentId, examId, answers, timeTakenSeconds } = req.body;

    try {
        // 1. Fetch Exam Registry
        const { data: exam } = await supabase.from('exams').select('*').eq('id', examId).single();
        if (!exam) throw new Error('Exam cluster not found');

        // 2. Fetch Knowledge Fragments (Correct Answers)
        const { data: questionData } = await supabase
            .from('questions')
            .select('id, correct_option_index')
            .in('id', exam.question_ids);

        // 3. Calculation Logic
        let correctCount = 0;
        let wrongCount = 0;
        
        questionData.forEach(q => {
            const studentAns = answers[q.id];
            if (studentAns === undefined) return; // Skipped
            if (studentAns === q.correct_option_index) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        // Apply Scoring Protocol
        const marksPerQ = exam.marks_per_question || 1.0;
        const penaltyPerQ = exam.negative_marking || 0.0;
        
        const correctPoints = correctCount * marksPerQ;
        const totalPenalty = wrongCount * penaltyPerQ;
        
        const score = Math.max(0, correctPoints - totalPenalty);
        const totalMarks = questionData.length * marksPerQ;
        
        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
        const status = percentage >= exam.pass_percentage ? 'PASS' : 'FAIL';

        // 4. Persistence
        const resultId = Math.random().toString(36).substr(2, 9);
        const certificateId = status === 'PASS' ? `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : null;

        const { data: result, error } = await supabase.from('results').insert({
            id: resultId,
            student_id: studentId,
            exam_id: examId,
            score,
            total_marks: Math.round(totalMarks),
            correct_answers: correctCount,
            wrong_answers: wrongCount,
            time_taken_seconds: timeTakenSeconds,
            status,
            certificate_id: certificateId
        }).select().single();

        if (error) throw error;

        // 5. Success Dispatch
        res.json({ success: true, result });
    } catch (err) {
        console.error('Grading Error:', err);
        res.status(500).json({ error: 'Internal Grading Protocol Failure' });
    }
});

/**
 * ANALYTICAL REPORTS ENGINE
 * Aggregates global telemetry for Admin dashboard
 */
app.get('/api/v1/reports/summary', checkRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const [
            { count: totalStudents },
            { count: totalExams },
            { data: results }
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'STUDENT'),
            supabase.from('exams').select('*', { count: 'exact', head: true }),
            supabase.from('results').select('score, total_marks, status')
        ]);

        const passRate = results.length > 0 
            ? Math.round((results.filter(r => r.status === 'PASS').length / results.length) * 100) 
            : 0;

        res.json({
            totalStudents,
            totalExams,
            totalAttempts: results.length,
            globalPassRate: `${passRate}%`,
            systemHealth: 'Optimal'
        });
    } catch (err) {
        res.status(500).json({ error: 'Analytical Dispatch Failed' });
    }
});

/**
 * NOTIFICATION BROADCAST
 * Central authority broadcast to all students
 */
app.post('/api/v1/broadcast', checkRole(['SUPER_ADMIN']), async (req, res) => {
    const { title, message } = req.body;
    try {
        const { data: students } = await supabase.from('profiles').select('id').eq('role', 'STUDENT');
        const notifications = students.map(s => ({
            user_id: s.id,
            title,
            message,
            type: 'WARNING'
        }));

        await supabase.from('notifications').insert(notifications);
        res.json({ success: true, broadcastCount: notifications.length });
    } catch (err) {
        res.status(500).json({ error: 'Broadcast Protocol Fault' });
    }
});

app.listen(PORT, () => {
    console.log(`EduQuest Backend Core operational on port ${PORT}`);
});