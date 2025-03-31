class CourseView {
    constructor(selector) {
        this.selector = selector;
        this.semesterWidth = 200; // Semester column width
        this.tileHeight = 100;    // Cell height (spacing vertically)
        this.nodeWidth = 100;  // Width per semester column
        this.nodeHeight = 50; // Height per course tile

        this.svg = d3.select(selector)
            .append('svg');
    }

    render(data) {
        const svg = this.svg;
        const semesterWidth = this.semesterWidth;
        const tileHeight = this.tileHeight;
        const nodeWidth = this.nodeWidth;
        const nodeHeight = this.nodeHeight;

    
        // Calculate semester structure
        const semesters = {};
        data.nodes.forEach(node => {
            if (!semesters[node.semester]) semesters[node.semester] = [];
            semesters[node.semester].push(node);
        });

        const numSemesters = Object.keys(semesters).length;
        const maxCourses = d3.max(Object.values(semesters), d => d.length);

         // Set SVG dimensions dynamically
        const svgWidth = numSemesters * semesterWidth + 200;
        const svgHeight = maxCourses * tileHeight + 150;

        svg.attr("width", svgWidth)
            .attr("height", svgHeight);
    
        // Position nodes explicitly into grid cells
        Object.keys(semesters).forEach(semesterNum => {
            semesters[semesterNum].forEach((node, idx) => {
                node.x = (semesterNum - 1) * semesterWidth + semesterWidth / 2 + 100;
                node.y = idx * tileHeight + tileHeight / 2 + 80;
            });
        });
    
        // Semester columns and grid cells
        Object.keys(semesters).forEach(semesterNum => {
            const columnX = (semesterNum - 1) * semesterWidth + 100;
            const columnHeight = maxCourses * tileHeight;

    
            // Semester background
            svg.append("rect")
                .attr("x", columnX)
                .attr("y", 40)
                .attr("width", semesterWidth)
                .attr("height", columnHeight)
                .attr("fill", semesterNum % 2 ? "#f8f8f8" : "#ffffff")
                .attr("stroke", "#ccc");
    
            // Semester labels
            svg.append("text")
                .attr("x", columnX + semesterWidth / 2)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("fill", "#555")
                .text(`Semester ${semesterNum}`);
        });
    
        // Curved horizontal links using d3.linkHorizontal
        const linkGenerator = d3.linkHorizontal()
            .x(d => d.x)
            .y(d => d.y);
        
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#666")
            .attr("stroke-width", 2)
            .selectAll("path")
            .data(data.links)
            .enter().append("path")
            .attr("d", d => linkGenerator({
                source: { x: d.source.x + nodeWidth / 2, y: d.source.y },
                target: { x: d.target.x - nodeWidth / 2, y: d.target.y }
            }));
    
        // Nodes (Rectangles)
        const node = svg.append("g")
            .selectAll("rect")
            .data(data.nodes)
            .enter().append("rect")
            .attr("x", d => d.x - nodeWidth / 2)
            .attr("y", d => d.y - nodeHeight / 2)
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .attr("fill", "#1f77b4")
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("stroke", "#333")
            .attr("cursor", "pointer")
            .on("click", (event, d) => highlightPrerequisites(d, data));
    
        // Node labels (course ID)
        svg.append("g")
            .selectAll("text.course")
            .data(data.nodes)
            .enter().append("text")
            .attr("class", "course")
            .attr("x", d => d.x)
            .attr("y", d => d.y + 5)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .text(d => d.id)
            .attr("pointer-events", "none");
    
        // Highlighting prerequisites on click
        function highlightPrerequisites(selectedNode, graphData) {
            node.attr("fill", "#bbb");
            svg.selectAll("path").attr("stroke", "#ddd");
    
            const visited = new Set();
            const traverse = (nodeId) => {
                visited.add(nodeId);
                graphData.links.forEach(link => {
                    if (link.target.id === nodeId && !visited.has(link.source.id)) {
                        traverse(link.source.id);
                    }
                });
            };
            traverse(selectedNode.id);
    
            node.attr("fill", d => visited.has(d.id) ? "#ff7f0e" : "#bbb");
            svg.selectAll("path").attr("stroke", d => visited.has(d.source.id) && visited.has(d.target.id) ? "#ff7f0e" : "#ddd");
        }
    }
    
    
}
