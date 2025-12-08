/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management, creation, publishing, and access control
 */

/**
 * @swagger
 * /api/course/search:
 *   get:
 *     summary: Search for courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Keyword to search for courses
 *     responses:
 *       200:
 *         description: List of matching courses
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/course/published-course:
 *   get:
 *     summary: Get all published courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully fetched published courses
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/course/free-courses:
 *   get:
 *     summary: Get all free courses (requires authentication)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of free courses
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/course/paid-courses:
 *   get:
 *     summary: Get all paid courses (requires authentication)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of paid courses
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/course/{courseId}/content:
 *   get:
 *     summary: Get limited (preview) content of a course
 *     tags: [Courses]
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
 *         description: Course content fetched successfully
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/course/{courseId}/full-content:
 *   get:
 *     summary: Get full course content (for enrolled users only)
 *     tags: [Courses]
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
 *         description: Full content retrieved
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/course/create:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               course_title:
 *                 type: string
 *               sub_title:
 *                 type: string
 *               description:
 *                 type: string
 *               course_level:
 *                 type: string
 *               category:
 *                 type: string
 *               course_type:
 *                 type: string
 *                 enum: [free, paid]
 *               course_thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/course/creator:
 *   get:
 *     summary: Get all courses created by the instructor/admin
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of creator's courses
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/course/edit/{courseId}:
 *   put:
 *     summary: Edit a course (admin/instructor only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               course_title:
 *                 type: string
 *               sub_title:
 *                 type: string
 *               description:
 *                 type: string
 *               course_thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/course/publish/{courseId}:
 *   patch:
 *     summary: Toggle course publish status
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course publish status updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/course/{courseId}:
 *   get:
 *     summary: Get course details by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details retrieved successfully
 *       404:
 *         description: Course not found
 */
