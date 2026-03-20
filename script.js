let students = ["Élève 1", "Élève 2", "Élève 3", "Élève 4"]; // Liste par défaut
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentRotation = 0;
let lastWinnerIndex = null;

// Gestion de l'import de fichier
document.getElementById('importFile').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        // Sépare par ligne ou par virgule
        students = reader.result.split(/[\n,]+/).map(s => s.trim()).filter(s => s !== "");
        drawWheel();
    };
    reader.readAsText(e.target.files[0]);
});

function drawWheel() {
    const numSegments = students.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    students.forEach((name, i) => {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${(i * 360) / numSegments}, 70%, 60%)`;
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i * anglePerSegment, (i + 1) * anglePerSegment);
        ctx.fill();
        ctx.stroke();

        // Ajout du texte
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * anglePerSegment + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText(name, 230, 10);
        ctx.restore();
    });
}

function spin() {
    if (students.length === 0) return alert("La liste est vide !");
    
    const extraDegrees = Math.floor(Math.random() * 360) + 3600; // 10 tours min
    currentRotation += extraDegrees;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Calcul du gagnant après l'animation (4s)
    setTimeout(() => {
        const actualRotation = currentRotation % 360;
        const segmentAngle = 360 / students.length;
        // On compense le fait que le pointeur est en haut (270°) et que la roue tourne dans le sens horaire
        const winnerIndex = Math.floor(((360 - actualRotation + 270) % 360) / segmentAngle);
        
        lastWinnerIndex = winnerIndex;
        document.getElementById('winner-name').innerText = students[winnerIndex];
        document.getElementById('result-modal').style.display = 'flex';
    }, 4000);
}

function removeWinner() {
    students.splice(lastWinnerIndex, 1);
    closeModal();
    drawWheel();
}

function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}

function resetWheel() {
    location.reload(); // Simple pour réinitialiser
}

// Premier dessin au chargement
drawWheel();