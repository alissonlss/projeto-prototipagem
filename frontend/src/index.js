// Selecionando elementos HTML
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
const closeWebcam = document.getElementById('closeWebcam');
const lineButton = document.getElementById('lineButton');
const addNum = document.getElementById('addNum');
const btnAddNumber = document.getElementById('btnAddNumber');
const tema = document.getElementById('tema');

const themeSystem = localStorage.getItem("themeSystem") || "light";
document.documentElement.setAttribute("data-theme", themeSystem);

const access_key = '';
const numWhats = ''; // No seguinte formato 55DD9XXXXXXXX

// Parametros para enviar mensagem
const urlBotWhats = 'https://api.bot.teasy.solutions/send/text';
const headersMessage = {
  'Content-Type': 'application/json',
  'access_key': access_key
};

const dataMessage = JSON.stringify({
  phoneNumber: numWhats,
  message: 'Seu animal fugiu!'
});


// Função para verificar se o acesso à webcam é suportado
function isUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Adicionar um evento de clique ao botão "Ativar Webcam"
if (isUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableWebcam);
} else {
    console.warn('getUserMedia() não é suportado pelo seu navegador');
}


// Função para ativar a webcam e começar a classificação
function enableWebcam(event) {
    // Verificar se o modelo COCO-SSD foi carregado
    if (!model) {
        return;
    }

    // Ocultar o botão após o clique
    event.target.classList.add('removed');

    // Parâmetros para solicitar somente vídeo
    const constraints = {
        video: true
    };

    // Ativar o stream da webcam
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
    });

    // Exibir o botão "Fechar Webcam" e o de ocultar linha
    closeWebcam.classList.remove('removed');
    lineButton.classList.remove('removed');

    video.scrollIntoView({ behavior: "smooth" })
}

// Variável para armazenar o modelo
var model = undefined;

// Carregar o modelo COCO-SSD e mostrar a seção de demonstração quando estiver pronto
function modelRun (){
    cocoSsd.load().then(function (loadedModel) {
        model = loadedModel;
        demosSection.classList.remove('invisible');
    });
}

modelRun();

// Array para armazenar elementos HTML
var children = [];

// variável para armazenar a existencia da linha
var lineExiste = false;

// variável para armazenar a espera entre as notificações
var seconds = 0;

function timeWait() {
  if (seconds > 0) {
    seconds--;
    // Chama a função iniciarContagem novamente após 1 segundo
    setTimeout(timeWait, 1000);
  } 
}

// Altera o conteúdo de um arquivo no drive para alertar a rasp
async function UpdateFileContent() {
    const url = 'http://localhost:3333/updateFileContent';
  
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Conteúdo do arquivo alterado com sucesso!")
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}


// Função para enviar mensagem
async function sendMessage() {
  await fetch(urlBotWhats, {
    method: 'POST',
    headers: headersMessage,
    body: dataMessage
  })
}


// Função para classificar frames da webcam
function predictWebcam() {
    const classMapping = ['person', 'dog', 'cat'];
    const bgColor = {'dog' : '#ff0381', 'cat' : '#6b026b'};
    const pets = ['dog', 'cat'];

    model.detect(video).then(async function (predictions) {

        for (let i = 0; i < children.length; i++) {
            liveView.removeChild(children[i]);
        }
        children.splice(0);

        const videoWidth = video.getBoundingClientRect().width;
        const videoHeight = video.getBoundingClientRect().height;

        const middleY = videoHeight / 2;

        // Desenha uma linha horizontal no meio do quadro
        if (!lineExiste){
            const line = document.createElement('div');
            line.id = "line";

            line.style.position = 'absolute';
            line.style.top = middleY + 'px';
            line.style.left = '0';
            line.style.width = videoWidth + 'px';
            line.style.height = '2px'; // Espessura da linha
            line.style.backgroundColor = 'red'; // Cor da linha
        
            liveView.appendChild(line);
            lineExiste = true;
        }

        for (let n = 0; n < predictions.length; n++) {
            let fator = 1;

            if (predictions[n].score > 0.66 && classMapping.includes(predictions[n].class)) {
                const p = document.createElement('p');
                p.id = "confidence";

                if (videoWidth == "320" && videoHeight == "240"){
                    fator = 2;
                } else if(videoWidth == "272" && videoHeight == "192"){
                    fator = 2.5;
                }

                p.innerText = predictions[n].class + ' - com ' +
                    Math.round(parseFloat(predictions[n].score) * 100) +
                    '% de confiança.';
                p.style = 'margin-left: ' + predictions[n].bbox[0]/fator + 'px; margin-top: ' +
                    (predictions[n].bbox[1]/fator - 10) + 'px; width: ' +
                    (predictions[n].bbox[2]/fator - 10) + 'px; top: 0; left: 0;';

                if (pets.includes(predictions[n].class)){
                    p.style.backgroundColor = bgColor[predictions[n].class];
                }

                const highlighter = document.createElement('div');
                highlighter.id = "frame";

                highlighter.setAttribute('class', 'highlighter');
                highlighter.style = 'left: ' + predictions[n].bbox[0]/fator + 'px; top: ' +
                    predictions[n].bbox[1]/fator + 'px; width: ' +
                    predictions[n].bbox[2]/fator + 'px; height: ' +
                    predictions[n].bbox[3]/fator + 'px;';

                // detecção de fuga
                const heightClass = predictions[n].bbox[1]/fator + predictions[n].bbox[3]/fator;
                
                if ((heightClass < videoHeight/2) && pets.includes(predictions[n].class) && seconds === 0){
                    video.classList.add("escaping");
                    UpdateFileContent();
                    seconds = 30;
                    await sendMessage();
                    window.alert("Seu pet está fugindo!!!");
                    timeWait();
                }

                if(video.classList.contains("escaping") && seconds === 0){
                    video.classList.remove("escaping");
                    UpdateFileContent();
                }

                liveView.appendChild(highlighter);
                liveView.appendChild(p);
                children.push(highlighter);
                children.push(p);
            }
        }

        window.requestAnimationFrame(predictWebcam);
    });
}


// Event listener para o botão "Fechar Webcam"
closeWebcam.addEventListener('click', () => {
    const confidence = document.getElementById('confidence');
    const frame = document.getElementById('frame');
    const line = document.getElementById('line');

    if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }

    // Ocultar o vídeo da visualização ao vivo
    if (confidence){
        liveView.removeChild(confidence);
    }
    if (frame){
       liveView.removeChild(frame); 
    }
    liveView.removeChild(line);
    
    // Ocultar o botão "Fechar Webcam" e o de "Ocultar Linha"
    closeWebcam.classList.add('removed');
    lineButton.classList.add('removed');

    // Exibir o botão "Ativar Webcam" novamente
    enableWebcamButton.classList.remove('removed');


    // reinicia as instancias
    children = []
    modelRun();
    lineExiste = false;

    // retorna ao todo
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })

});


lineButton.addEventListener("click", () => {
    const textButton = {"Ocultar Linha": "Mostrar Linha", "Mostrar Linha": "Ocultar Linha"};
    const line = document.getElementById('line');
    const text = lineButton.textContent;

    if (text === "Ocultar Linha"){
        line.classList.add("removed");
    } else {
        line.classList.remove("removed");
    }

    lineButton.innerText = textButton[text];
});


addNum.addEventListener("click", () =>{
    var secao = document.getElementById('addPhone');
    secao.scrollIntoView({ behavior: 'smooth' });

});


tema.addEventListener("click", () => {
    const oldTheme = localStorage.getItem("themeSystem") || "light";
    const newTheme = oldTheme == "light" ? "dark" : "light";
    localStorage.setItem("themeSystem", newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);
});


btnAddNumber.addEventListener("click", () => {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (phoneNumber.length < 13 || phoneNumber.length > 13){
        window.alert("Por favor forneça um número completo, siga o seguinte formato: 55DD9XXXXXXXX.");
    }else{
        window.alert("Número adicionado com sucesso!")
        document.getElementById('phoneNumber').value = "";
        // Lógica para adicionar no numero do drive
    }

});