/**
 * @swagger
 * tags:
 *   name: Lecture
 *   description: Manage course lectures (create, edit, view, and delete)
 */

/**
 * @swagger
 * /api/lecture/lecture:
 *   post:
 *     summary: Create a new lecture and link it to one or more courses
 *     tags: [Lecture]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - lectureTitle
 *               - courseIds
 *               - videoFile
 *             properties:
 *               lectureTitle:
 *                 type: string
 *                 description: Title of the lecture
 *               isPreviewFree:
 *                 type: boolean
 *                 description: Whether the lecture is available for free preview
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of course IDs to which this lecture belongs
 *               videoFile:
 *                 type: string
 *                 format: binary
 *                 description: Video file of the lecture
 *     responses:
 *       201:
 *         description: Lecture created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/lecture/{courseId}/lecture:
 *   get:
 *     summary: Get all lectures for a specific course
 *     tags: [Lecture]
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
 *         description: Successfully fetched course lectures
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/lecture/{courseId}/lecture/{lectureId}:
 *   put:
 *     summary: Edit an existing lecture (admin only)
 *     tags: [Lecture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               lectureTitle:
 *                 type: string
 *                 description: Updated lecture title
 *               isPreviewFree:
 *                 type: boolean
 *                 description: Updated preview status
 *               videoFile:
 *                 type: string
 *                 format: binary
 *                 description: Updated lecture video
 *     responses:
 *       200:
 *         description: Lecture updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Lecture not found
 */

/**
 * @swagger
 * /api/lecture/lecture/{lectureId}:
 *   delete:
 *     summary: Delete a lecture (admin only)
 *     tags: [Lecture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Lecture not found
 */

/**
 * @swagger
 * /api/lecture/lecture/{lectureId}:
 *   get:
 *     summary: Get lecture details by ID (admin only)
 *     tags: [Lecture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Lecture not found
 */
