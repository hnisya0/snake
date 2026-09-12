// =====================================
// SNAKE GAME 2D
// =====================================


// =====================================
// GOOGLE SHEETS
// =====================================

// Nanti masukkan URL Google Apps Script
// setelah Google Sheets selesai dibuat.

const API_URL = "";


// =====================================
// AMBIL ELEMENT HTML
// =====================================

const menu =
    document.getElementById("menu");

const gameScreen =
    document.getElementById("gameScreen");

const gameOver =
    document.getElementById("gameOver");

const leaderboard =
    document.getElementById("leaderboard");


const usernameInput =
    document.getElementById("username");

const whatsappInput =
    document.getElementById("whatsapp");


const playerName =
    document.getElementById("playerName");

const scoreText =
    document.getElementById("score");

const finalScore =
    document.getElementById("finalScore");


const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// =====================================
// DATA GAME
// =====================================

const ukuranKotak = 20;

const jumlahKotak =
    canvas.width / ukuranKotak;


let snake = [];

let makanan = {
    x: 0,
    y: 0
};


let arah = "RIGHT";

let score = 0;

let gameInterval = null;


let username = "";

let whatsapp = "";


// =====================================
// TOMBOL MULAI
// =====================================

document
    .getElementById("btnMulai")
    .addEventListener(
        "click",
        mulaiGame
    );


// =====================================
// MULAI GAME
// =====================================

function mulaiGame() {

    username =
        usernameInput.value.trim();

    whatsapp =
        whatsappInput.value.trim();


    // Validasi username

    if (username === "") {

        alert(
            "Silakan masukkan username!"
        );

        usernameInput.focus();

        return;
    }


    // Validasi WhatsApp

    if (whatsapp === "") {

        alert(
            "Silakan masukkan nomor WhatsApp!"
        );

        whatsappInput.focus();

        return;
    }


    // Tampilkan nama pemain

    playerName.textContent =
        username;


    // Sembunyikan semua halaman

    menu.classList.add("hidden");

    gameOver.classList.add("hidden");

    leaderboard.classList.add("hidden");


    // Tampilkan game

    gameScreen.classList.remove(
        "hidden"
    );


    // Reset score

    score = 0;

    updateScore();


    // Arah awal

    arah = "RIGHT";


    // Buat ular

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


    // Buat makanan

    buatMakanan();


    // Hentikan interval lama

    if (gameInterval !== null) {

        clearInterval(
            gameInterval
        );

    }


    // Jalankan game

    gameInterval =
        setInterval(
            updateGame,
            120
        );


    // Gambar awal

    gambarGame();

}


// =====================================
// UPDATE GAME
// =====================================

function updateGame() {

    const kepala = {

        x: snake[0].x,

        y: snake[0].y

    };


    // Gerakan ular

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


    // =================================
    // CEK TABRAK DINDING
    // =================================

    if (

        kepala.x < 0 ||

        kepala.x >= canvas.width ||

        kepala.y < 0 ||

        kepala.y >= canvas.height

    ) {

        selesaiGame();

        return;

    }


    // =================================
    // CEK TABRAK TUBUH
    // =================================

    for (
        let i = 0;
        i < snake.length;
        i++
    ) {

        if (

            kepala.x === snake[i].x &&

            kepala.y === snake[i].y

        ) {

            selesaiGame();

            return;

        }

    }


    // Masukkan kepala baru

    snake.unshift(kepala);


    // =================================
    // CEK MAKANAN
    // =================================

    if (

        kepala.x === makanan.x &&

        kepala.y === makanan.y

    ) {

        // Tambah score

        score += 10;

        updateScore();


        // Buat makanan baru

        buatMakanan();

    }

    else {

        // Hapus ekor

        snake.pop();

    }


    // Gambar game

    gambarGame();

}


// =====================================
// GAMBAR GAME
// =====================================

function gambarGame() {

    // Background

    ctx.fillStyle = "#101820";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    // =================================
    // GRID
    // =================================

    ctx.strokeStyle =
        "rgba(255,255,255,0.04)";


    for (
        let x = 0;
        x <= canvas.width;
        x += ukuranKotak
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= canvas.height;
        y += ukuranKotak
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }


    // =================================
    // MAKANAN
    // =================================

    ctx.fillStyle = "#ff4757";

    ctx.beginPath();

    ctx.arc(

        makanan.x + 9,

        makanan.y + 9,

        8,

        0,

        Math.PI * 2

    );

    ctx.fill();


    // =================================
    // ULAR
    // =================================

    snake.forEach(
        (bagian, index) => {

            if (index === 0) {

                // Kepala

                ctx.fillStyle =
                    "#2ecc71";

            }
            else {

                // Badan

                ctx.fillStyle =
                    "#27ae60";

            }


            ctx.fillRect(

                bagian.x + 1,

                bagian.y + 1,

                ukuranKotak - 2,

                ukuranKotak - 2

            );


            // Mata kepala

            if (index === 0) {

                ctx.fillStyle = "white";

                ctx.beginPath();

                ctx.arc(

                    bagian.x + 6,

                    bagian.y + 6,

                    2,

                    0,

                    Math.PI * 2

                );

                ctx.fill();


                ctx.beginPath();

                ctx.arc(

                    bagian.x + 14,

                    bagian.y + 6,

                    2,

                    0,

                    Math.PI * 2

                );

                ctx.fill();

            }

        }
    );

}


// =====================================
// BUAT MAKANAN RANDOM
// =====================================

function buatMakanan() {

    let posisiValid = false;


    while (!posisiValid) {

        makanan = {

            x:
                Math.floor(
                    Math.random() *
                    jumlahKotak
                ) * ukuranKotak,

            y:
                Math.floor(
                    Math.random() *
                    jumlahKotak
                ) * ukuranKotak

        };


        posisiValid =
            !snake.some(
                bagian =>

                    bagian.x === makanan.x &&

                    bagian.y === makanan.y

            );

    }

}


// =====================================
// UPDATE SCORE
// =====================================

function updateScore() {

    scoreText.textContent =
        score;

}


// =====================================
// GAME OVER
// =====================================

function selesaiGame() {

    if (gameInterval !== null) {

        clearInterval(
            gameInterval
        );

        gameInterval = null;

    }


    // Sembunyikan game

    gameScreen.classList.add(
        "hidden"
    );


    // Tampilkan game over

    gameOver.classList.remove(
        "hidden"
    );


    // Tampilkan score

    finalScore.textContent =
        score;


    // Simpan score

    simpanScore();

}


// =====================================
// KEYBOARD
// =====================================

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


// =====================================
// KONTROL HP
// =====================================

const controlButtons =
    document.querySelectorAll(
        ".control"
    );


controlButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                const arahBaru =
                    this.dataset.direction;


                if (

                    arahBaru === "UP" &&

                    arah !== "DOWN"

                ) {

                    arah = "UP";

                }


                if (

                    arahBaru === "DOWN" &&

                    arah !== "UP"

                ) {

                    arah = "DOWN";

                }


                if (

                    arahBaru === "LEFT" &&

                    arah !== "RIGHT"

                ) {

                    arah = "LEFT";

                }


                if (

                    arahBaru === "RIGHT" &&

                    arah !== "LEFT"

                ) {

                    arah = "RIGHT";

                }

            }
        );

    }
);


// =====================================
// MAIN LAGI
// =====================================

document
    .getElementById("btnMainLagi")
    .addEventListener(
        "click",
        mulaiGame
    );


// =====================================
// KEMBALI MENU
// =====================================

function kembaliMenu() {

    if (gameInterval !== null) {

        clearInterval(
            gameInterval
        );

        gameInterval = null;

    }


    gameScreen.classList.add(
        "hidden"
    );

    gameOver.classList.add(
        "hidden"
    );

    leaderboard.classList.add(
        "hidden"
    );


    menu.classList.remove(
        "hidden"
    );

}


// Tombol menu dari game

document
    .getElementById("btnMenuGame")
    .addEventListener(
        "click",
        kembaliMenu
    );


// Tombol menu dari game over

document
    .getElementById("btnMenuGameOver")
    .addEventListener(
        "click",
        kembaliMenu
    );


// Tombol menu leaderboard

document
    .getElementById("btnMenuLeaderboard")
    .addEventListener(
        "click",
        kembaliMenu
    );


// =====================================
// LEADERBOARD
// =====================================

document
    .getElementById("btnLeaderboard")
    .addEventListener(
        "click",
        lihatLeaderboard
    );


document
    .getElementById(
        "btnLeaderboardGameOver"
    )
    .addEventListener(
        "click",
        lihatLeaderboard
    );


async function lihatLeaderboard() {

    // Sembunyikan halaman

    menu.classList.add("hidden");

    gameScreen.classList.add("hidden");

    gameOver.classList.add("hidden");


    // Tampilkan leaderboard

    leaderboard.classList.remove(
        "hidden"
    );


    const container =
        document.getElementById(
            "leaderboardData"
        );


    // Jika API belum dipasang

    if (API_URL === "") {

        container.innerHTML = `

            <div class="rank">

                <span class="rank-name">
                    🥇 Demo Player
                </span>

                <span class="rank-score">
                    100
                </span>

            </div>

            <div class="rank">

                <span class="rank-name">
                    🥈 Snake Master
                </span>

                <span class="rank-score">
                    80
                </span>

            </div>

            <div class="rank">

                <span class="rank-name">
                    🥉 Player 03
                </span>

                <span class="rank-score">
                    60
                </span>

            </div>

            <p style="padding:15px;font-size:13px;">
                Hubungkan Google Sheets
                untuk menampilkan data asli.
            </p>

        `;

        return;

    }


    container.innerHTML =
        "⏳ Memuat leaderboard...";


    try {

        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        // Urutkan score terbesar

        data.sort(
            (a, b) =>
                Number(b.score) -
                Number(a.score)
        );


        // Ambil TOP 10

        const top10 =
            data.slice(0, 10);


        container.innerHTML = "";


        top10.forEach(
            (player, index) => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "rank";


                let medal = "";


                if (index === 0) {
                    medal = "🥇";
                }

                else if (index === 1) {
                    medal = "🥈";
                }

                else if (index === 2) {
                    medal = "🥉";
                }

                else {
                    medal =
                        `#${index + 1}`;
                }


                row.innerHTML = `

                    <span class="rank-name">

                        ${medal}
                        ${player.username}

                    </span>

                    <span class="rank-score">

                        ${player.score}

                    </span>

                `;


                container.appendChild(row);

            }
        );


        if (top10.length === 0) {

            container.innerHTML =
                "Belum ada data pemain.";

        }


    }

    catch (error) {

        console.error(error);

        container.innerHTML =
            "❌ Gagal mengambil data leaderboard.";

    }

}


// =====================================
// SIMPAN SCORE
// =====================================

async function simpanScore() {

    // Google Sheets belum dipasang

    if (API_URL === "") {

        console.log(
            "Google Sheets belum terhubung."
        );

        console.log({

            username: username,

            whatsapp: whatsapp,

            score: score

        });

        return;

    }


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    body:
                        JSON.stringify({

                            username:
                                username,

                            whatsapp:
                                whatsapp,

                            score:
                                score

                        })

                }
            );


        const result =
            await response.json();


        console.log(
            "Score tersimpan:",
            result
        );


    }

    catch (error) {

        console.error(
            "Gagal menyimpan score:",
            error
        );

    }

}
