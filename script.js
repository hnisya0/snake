// ======================================
// GOOGLE APPS SCRIPT
// ======================================

const API_URL =
    "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI";


// ======================================
// ELEMENT HTML
// ======================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// ======================================
// DATA GAME
// ======================================

const ukuranKotak = 20;

let snake = [];

let makanan = {
    x: 200,
    y: 200
};

let arah = "RIGHT";

let score = 0;

let gameLoop;

let username = "";

let whatsapp = "";


// ======================================
// MULAI GAME
// ======================================

function mulaiGame() {

    username =
        document.getElementById("username").value.trim();

    whatsapp =
        document.getElementById("whatsapp").value.trim();


    if (username === "") {

        alert("Username wajib diisi!");

        return;
    }


    if (whatsapp === "") {

        alert("Nomor WhatsApp wajib diisi!");

        return;
    }


    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    document.getElementById("leaderboard")
        .classList.add("hidden");

    document.getElementById("gameScreen")
        .classList.remove("hidden");


    document.getElementById("playerName")
        .textContent = username;


    score = 0;

    arah = "RIGHT";


    snake = [

        {
            x: 200,
            y: 200
        },

        {
            x: 180,
            y: 200
        },

        {
            x: 160,
            y: 200
        }

    ];


    buatMakanan();

    updateScore();


    clearInterval(gameLoop);

    gameLoop =
        setInterval(updateGame, 120);
}


// ======================================
// UPDATE GAME
// ======================================

function updateGame() {

    const kepala = {
        x: snake[0].x,
        y: snake[0].y
    };


    if (arah === "UP") {
        kepala.y -= ukuranKotak;
    }

    if (arah === "DOWN") {
        kepala.y += ukuranKotak;
    }

    if (arah === "LEFT") {
        kepala.x -= ukuranKotak;
    }

    if (arah === "RIGHT") {
        kepala.x += ukuranKotak;
    }


    // Tabrak dinding

    if (
        kepala.x < 0 ||
        kepala.x >= canvas.width ||
        kepala.y < 0 ||
        kepala.y >= canvas.height
    ) {

        selesaiGame();

        return;
    }


    // Tabrak tubuh sendiri

    for (let i = 0; i < snake.length; i++) {

        if (
            kepala.x === snake[i].x &&
            kepala.y === snake[i].y
        ) {

            selesaiGame();

            return;
        }
    }


    snake.unshift(kepala);


    // Makan makanan

    if (
        kepala.x === makanan.x &&
        kepala.y === makanan.y
    ) {

        score += 10;

        updateScore();

        buatMakanan();

    } else {

        snake.pop();
    }


    gambarGame();
}


// ======================================
// GAMBAR GAME
// ======================================

function gambarGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Makanan

    ctx.fillStyle = "red";

    ctx.fillRect(
        makanan.x,
        makanan.y,
        ukuranKotak,
        ukuranKotak
    );


    // Ular

    snake.forEach((bagian, index) => {

        if (index === 0) {

            ctx.fillStyle = "#2ecc71";

        } else {

            ctx.fillStyle = "#27ae60";
        }


        ctx.fillRect(
            bagian.x,
            bagian.y,
            ukuranKotak - 2,
            ukuranKotak - 2
        );

    });
}


// ======================================
// BUAT MAKANAN
// ======================================

function buatMakanan() {

    makanan.x =
        Math.floor(
            Math.random() *
            (canvas.width / ukuranKotak)
        ) * ukuranKotak;


    makanan.y =
        Math.floor(
            Math.random() *
            (canvas.height / ukuranKotak)
        ) * ukuranKotak;
}


// ======================================
// SCORE
// ======================================

function updateScore() {

    document.getElementById("score")
        .textContent = score;
}


// ======================================
// GAME OVER
// ======================================

function selesaiGame() {

    clearInterval(gameLoop);


    document.getElementById("gameScreen")
        .classList.add("hidden");


    document.getElementById("gameOver")
        .classList.remove("hidden");


    document.getElementById("finalScore")
        .textContent = score;


    simpanScore();
}


// ======================================
// KEYBOARD
// ======================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowUp" &&
            arah !== "DOWN"
        ) {

            arah = "UP";
        }


        if (
            event.key === "ArrowDown" &&
            arah !== "UP"
        ) {

            arah = "DOWN";
        }


        if (
            event.key === "ArrowLeft" &&
            arah !== "RIGHT"
        ) {

            arah = "LEFT";
        }


        if (
            event.key === "ArrowRight" &&
            arah !== "LEFT"
        ) {

            arah = "RIGHT";
        }

    }
);


// ======================================
// SIMPAN SCORE KE GOOGLE SHEETS
// ======================================

async function simpanScore() {

    try {

        await fetch(API_URL, {

            method: "POST",

            body: JSON.stringify({

                username: username,

                whatsapp: whatsapp,

                score: score

            })

        });

        console.log("Score berhasil disimpan");

    } catch (error) {

        console.log(
            "Gagal menyimpan score:",
            error
        );
    }
}


// ======================================
// LEADERBOARD
// ======================================

async function lihatLeaderboard() {

    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    document.getElementById("leaderboard")
        .classList.remove("hidden");


    const container =
        document.getElementById("leaderboardData");


    container.innerHTML =
        "⏳ Memuat leaderboard...";


    try {

        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        container.innerHTML = "";


        data
            .sort(
                (a, b) =>
                    Number(b.score) -
                    Number(a.score)
            )
            .slice(0, 10)
            .forEach(
                (player, index) => {

                    const div =
                        document.createElement("div");

                    div.className = "rank";


                    div.innerHTML = `

                        <span>
                            #${index + 1}
                            ${player.username}
                        </span>

                        <strong>
                            ${player.score}
                        </strong>

                    `;


                    container.appendChild(div);

                }
            );


    } catch (error) {

        container.innerHTML =
            "❌ Gagal mengambil leaderboard.";
    }
}


// ======================================
// KEMBALI MENU
// ======================================

function kembaliMenu() {

    clearInterval(gameLoop);


    document.getElementById("gameScreen")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    document.getElementById("leaderboard")
        .classList.add("hidden");

    document.getElementById("menu")
        .classList.remove("hidden");
}
