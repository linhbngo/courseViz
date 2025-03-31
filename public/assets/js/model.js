class CourseModel {
    async loadCourses() {
        const response = await fetch('/api/courses');
        const courses = await response.json();

        // Map for quick lookup
        const courseMap = new Map(courses.map(course => [course.id, course]));

        // Recursive function to determine course semester
        const courseSemester = {};
        function assignSemester(courseId) {
            if (courseSemester[courseId]) return courseSemester[courseId];
            const course = courseMap.get(courseId);
            if (!course.prerequisites.length) {
                courseSemester[courseId] = 1;
            } else {
                const prereqSemesters = course.prerequisites.map(assignSemester);
                courseSemester[courseId] = Math.max(...prereqSemesters) + 1;
            }
            return courseSemester[courseId];
        }

        // Assign semesters
        courses.forEach(c => assignSemester(c.id));

        const nodes = courses.map(course => ({
            id: course.id,
            name: course.name,
            semester: courseSemester[course.id]
        }));

        const nodeById = new Map(nodes.map(n => [n.id,n]));

        const links = courses.flatMap(course =>
            course.prerequisites.map(prereq => ({
                source: nodeById.get(prereq),
                target: nodeById.get(course.id)
            }))
        );

        return { nodes, links };
    }
}
