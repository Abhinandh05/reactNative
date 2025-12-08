/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: Manage course enrollment, access control, and student course progress
 */

/**
 * @swagger
 * /api/enrollment/grant:
 *   post:
 *     summary: Grant a student access to a course (admin only)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to grant access
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *     responses:
 *       201:
 *         description: Course access granted successfully
 *       400:
 *         description: Invalid request or user already enrolled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/enrollment/bulk-grant:
 *   post:
 *     summary: Grant course access to multiple users (admin only)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - userIds
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs
 *     responses:
 *       201:
 *         description: Course access granted in bulk successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/enrollment/revoke/{enrollmentId}:
 *   patch:
 *     summary: Revoke a student's course access (admin only)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the enrollment record to revoke
 *     responses:
 *       200:
 *         description: Course access revoked successfully
 *       404:
 *         description: Enrollment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/enrollment/course/{courseId}:
 *   get:
 *     summary: Get all enrollments for a specific course (admin only)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Successfully retrieved course enrollments
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/enrollment/my-courses:
 *   get:
 *     summary: Get all courses a student is enrolled in
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched enrolled courses
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/enrollment/check-access/{courseId}:
 *   get:
 *     summary: Check if a student has access to a specific course
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Access status returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or access denied
 */

/**
 * @swagger
 * /api/enrollment/course-content/{courseId}:
 *   get:
 *     summary: Get enrolled student's course content
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course content retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */
