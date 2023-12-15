# Smart Fence

## Descrição da ideia:

O nosso protótipo consiste em uma cerca virtual para pets, no qual utiliza câmeras de segurança para a identificação de animais de estimação em fuga residencial e aciona um alarme para avisar aos seus donos de que o pet está se afastando da residência.

## Justificativa:

Esse projeto foi desenvolvido a fim de evitar novos desaparecimentos de pets e em casos de desaparecimento facilitar o resgate do mesmo a partir de um aviso imediato da fuga.

## Requisitos funcionais:

* Câmera interligada a um sistema de vigilância;
* Identificação de pet fugindo por muros (simulado por linha);
* Emitir alarme ao identificar o animal sozinho;
* Enviar mensagem quando o animal fugir.

## Requisitos não funcionais:

* Facilidade de utilização;
* Compatibilidade com multiplataformas;
* Segurança e privacidade.

## Descrição dos insumos e/ou recursos de software:

* Raspberry Pi 3;
* Câmera de 1080p;
* Buzzer;
* Visão computacional.

## Descrição das tecnologias utilizadas:

### Front-end:
* HTML;
* CSS;
* JavaScript;
* Vite;
* Tensonflow;
* Coco-SSD;

### Back-end/API-Drive:
* Node.js;
* JavaScript;
* Express;
* Googleapis;
* Eslint.

### Raspberry:
* Python;
* RPi.GPIO;
* Requests;

### Versionamento/Deploy:
* GitHub;
* Vercel.

## Funcionamento do protótipo:

Ao ser identificado que o pet passou pela linha de referência, será enviado um alerta no whatsapp do dono, além de acionar o buzzer para auxiliar no alerta.
![funcionamento](https://github.com/alissonlss/projeto-prototipagem/assets/113796754/f2244a7b-e54c-4d6d-ac39-18e70d902e7e)


## Arquitetura do protótipo:

A imagem a seguir demonstra como as partes do projeto estão se comunicando/interagindo entre si.
![arquitetura_prototipo](https://github.com/alissonlss/projeto-prototipagem/assets/113796754/68edd700-dd49-4b07-adae-424f4ba71189)

## Esquemático eletrônico:

A imagem a seguir apresenta como os elemento de hardware estão conectados no nosso sistema.
![esquematico](https://github.com/alissonlss/projeto-prototipagem/assets/113796754/422c540c-20c5-4d9e-98b2-0038126e0710)

## Demostração do funcionamento:
Veja como o nosso sistema funciona na prática por meio de seguinte [vídeo](https://youtu.be/qcqvNdEBFVs?si=CcK924Bmi9kbpYYI).

É possível também acessar a nossa aplicação web [aqui](https://smart-fence-frontend.vercel.app/).


## Equipe:

* Álisson Leandro de Souza Silva;
* Amanda Ferreira da Silva Alves;
* Ana Carolina Dutra Ramos;
* Gabriel Albino de Oliveira;
* Sara Aymê Marinho Gaspar.
