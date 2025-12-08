/**
 * @swagger
 * tags:
 *   name: Course Progress
 *   description: Manage student course and lecture progress tracking
 */

/**
 * @swagger
 * /api/course-progress/{courseId}:
 *   get:
 *     summary: Get course progress for the authenticated user
 *     description: Retrieves the student's progress for a specific course, including lecture completion status.
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Successfully retrieved course progress
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or user not enrolled
 */

/**
 * @swagger
 * /api/course-progress/{courseId}/lecture/{lectureId}:
 *   put:
 *     summary: Update lecture progress for a user
 *     description: Marks a lecture as started, completed, or updates the progress percentage for the authenticated user.
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lecture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: number
 *                 description: Percentage of lecture watched (0–100)
 *               completed:
 *                 type: boolean
 *                 description: Whether the lecture is fully completed
 *             example:
 *               progress: 85
 *               completed: false
 *     responses:
 *       200:
 *         description: Lecture progress updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lecture or course not found
 */

/**
 * @swagger
 * /api/course-progress/{courseId}/complete:
 *   put:
 *     summary: Mark an entire course as completed
 *     description: Marks the course as completed for the authenticated user when all lectures are done.
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to mark as complete
 *     responses:
 *       200:
 *         description: Course marked as completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or not enrolled
 */

/**
 * @swagger
 * /api/course-progress/{courseId}/incomplete:
 *   put:
 *     summary: Mark an entire course as incomplete
 *     description: Allows a user to mark a course as incomplete (e.g., if progress needs to be reset or resumed later).
 *     tags: [Course Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to mark as incomplete
 *     responses:
 *       200:
 *         description: Course marked as incomplete successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or not enrolled
 */
