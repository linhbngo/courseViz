class CourseController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async initialize() {
        const data = await this.model.loadCourses();
        console.log("Controller received data:", data);
        this.view.render(data);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new CourseController(
        new CourseModel(),
        new CourseView("#graph")
    );
    app.initialize();
});
