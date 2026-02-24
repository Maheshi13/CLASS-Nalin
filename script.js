const sheetId = '1jWTsYWc4c4PXZ3Ms6Z43zXciPhWtYOk5Wit5eTO2R68'; // Replace this!
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

let allVideos = [];

async function init() {
    try {
        const res = await fetch(base);
        const text = await res.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        allVideos = json.table.rows.map(r => ({
            grade: r.c[0] ? r.c[0].v.toString().trim() : "",
            topic: r.c[1] ? r.c[1].v : "Untitled Lesson",
            id: r.c[2] ? r.c[2].v : ""
        }));
    console.log("Data loaded successfully!", allVideos);
    } catch(e) {
        console.error("Error loading data:", e);
        document.getElementById('status-msg').innerText = "Connection Error. Please refresh.";
    }
}

function filterVideos(grade, btn) {
    document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const grid = document.getElementById('video-grid');
    const msg = document.getElementById('status-msg');
    
    msg.style.display = 'none';
    grid.innerHTML = '';
    
    const filtered = allVideos.filter(v => v.grade === grade);
    
    if(filtered.length === 0) {
        msg.style.display = 'block';
        msg.innerText = "No videos found for this grade.";
        return;
    }

    filtered.forEach(v => {
        grid.innerHTML += `
            <div class="v-card">
                <iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen></iframe>
                <h3>${v.topic}</h3>
            </div>
        `;
    });
}

init();