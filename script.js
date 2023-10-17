let pontuacao = 0;
let ranking = [];

        // Função para iniciar o jogo
        function startGame() {
          const gameContainer = document.getElementById("game-container");
          const startButton = document.getElementById("start-game");
          const playerButton = document.getElementById("play-music");
          const lblResposta = document.getElementById("lbl-resposta");
          const resposta = document.getElementById("resposta");
          const btnResposta = document.getElementById("btn-resposta");
          startButton.remove();
          const countdown = document.createElement("h1");
          countdown.innerText = "3";
          gameContainer.appendChild(countdown);
          setTimeout(() => {
            countdown.innerText = "2";
            setTimeout(() => {
              countdown.innerText = "1";
              setTimeout(() => {
                countdown.remove();
                playerButton.classList.remove("hidden");
                resposta.classList.remove("hidden");
                lblResposta.classList.remove("hidden");
                btnResposta.classList.remove("hidden");     
              }, 1000);
            }, 1000);
          }, 1000);

          displayRanking();
        }

        let player;
        let trackName;

        window.onSpotifyWebPlaybackSDKReady = () => {
          //atualize o token quando a Kelly mandar um novo
          const token = "BQBpkFdhImca9aigSD-rXAwK1VongkJX81yW74g7r-Oni5yIjOPhGz7en1XrbsQMRykg0tBQyQ_a_PTRA2paUzOk8VjAKJiQR9eql5oERWvImCKJfSd8eEzxHvBtQkwhMeE3T-iRcFmLtWVsgNA-qKzCgjkXDWwfBAbvU57y1Xy-YOInEW2KeCCCYOzJn95W6PEcKjyepX1hwReDrrNC-xXETgxW";
          player = new Spotify.Player({
            name: "Web Playback SDK Quick Start Player",
            getOAuthToken: (cb) => {
              cb(token);
            },
            volume: 0.5,
          });

          player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            const connect_to_device = () => {
              //aqui, só copiei o link da sua playlist, no meu fiz isso e deu certo
              let album_uri = "spotify:playlist:1dPK0dj6saXm3SidjcKj0C"
              fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: "PUT",
                body: JSON.stringify({
                  context_uri: album_uri,
                  play: false,
                }),
                headers: new Headers({
                  "Authorization": "Bearer " + token,
                }),
              }).then(response => console.log(response))
                .then(data => {
                  player.addListener('player_state_changed', ({
                    track_window
                  }) => {
                    trackName = track_window.current_track.name;
                    trackName = trackName.toLowerCase();
                    console.log('Current Track:', trackName);
                  });
                })
            }
            connect_to_device();
          });

          document.getElementById("play-music").addEventListener('click', () => {
            player.togglePlay();
            setTimeout(() => {
              player.pause();
            }, 13000);
          });

          document.getElementById("btn-resposta").addEventListener('click', (event) => {
            event.preventDefault();
            let resposta = document.getElementById("resposta").value;
            resposta = resposta.toLowerCase();
            if (resposta == trackName) {
              alert("Você Acertou, Parabéns!");
              document.getElementById("resposta").value = "";
              // Aumentar a pontuação em 10 pontos quando o jogador acertar
              pontuacao += 10;
              // Exibir a pontuação na interface do usuário
              document.getElementById("pontuacao").innerHTML = `<h1>PONTUAÇÃO:${pontuacao}</h1>`;
              player.nextTrack();
              setTimeout(() => {
                player.pause();
              }, 1300);
            } else {
              alert("Você errou, tente novamente!");
              // Reduzir a pontuação em 5 pontos quando o jogador errar
              pontuacao -= 5;
              // Certificar-se de que a pontuação não seja menor que zero
              if (pontuacao < 0) {
                pontuacao = 0;
              }
              // Exibir a pontuação atualizada na interface do usuário
              document.getElementById("pontuacao").innerHTML = `<h1>PONTUAÇÃO:${pontuacao}</h1>`;
            }
          });

          player.connect();
        };

        function handleCorrectAnswer() {
          alert("Você Acertou, Parabéns!");
          document.getElementById("resposta").value = "";
          
          // Aumentar a pontuação em 10 pontos quando o jogador acertar
          pontuacao += 10;
          // Certifique-se de que a pontuação não seja menor que zero
          if (pontuacao < 0) {
            pontuacao = 0;
          }
        
          // Adicione a pontuação ao ranking
          ranking.push({ nome: document.getElementById("nome").value, pontuacao });
          
          // Exibir a pontuação e ranking atualizados na interface do usuário
          document.getElementById("pontuacao").innerHTML = `<h1>PONTUAÇÃO:${pontuacao}</h1>`;
          displayRanking();
        }

        function displayRanking() {
          const rankingContainer = document.getElementById("ranking");
          rankingContainer.innerHTML = "<h2>Ranking:</h2>";
        
          // Classifique o ranking com base na pontuação
          ranking.sort((a, b) => b.pontuacao - a.pontuacao);
        
          ranking.forEach((entry, index) => {
            const rankingPosition = index + 1;
            rankingContainer.innerHTML += `<p>${rankingPosition}. ${entry.nome} - ${entry.pontuacao} pontos</p>`;
          });
        }
        







