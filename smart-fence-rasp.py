import requests
#import RPi.GPIO as GPIO    # Descomente quando for rodar na raspberry
import time

# Obtem o dado de resposta do drive, no qual indica se liga ou nao o buzzer
id = '' # Id do arquivo que voce quer ler
google_drive_url = 'https://drive.google.com/uc?id=' + id

requests.post('http://localhost:3333/initialFileContent')
response = requests.get(google_drive_url)

# Descomente quando for rodar na raspberry
''' # Função acionar o buzzer
def acionar_buzzer():
    # Configurar a biblioteca para usar a numeração do pino GPIO (BCM)
    GPIO.setmode(GPIO.BCM)

    # Definir o número do pino que você deseja controlar
    pin_number = 26

    # Configurar o pino como saída
    GPIO.setup(pin_number, GPIO.OUT)

    # Enviar um sinal de nível alto (1) para o pino
    GPIO.output(pin_number, GPIO.HIGH)

    time.sleep(10)
   
    # Enviar um sinal de nível baixo (0) para o pino
    GPIO.output(pin_number, GPIO.LOW)
''' 

while (response.status_code == 200):
    # Conteudo do arquivo do drive
    conteudo = response.text
    
    if(str(conteudo) == "1"):
        # acionar_buzzer(); # Descomente quando for rodar na raspberry
        print("O animal fugiu!")
        time.sleep(31) # Na rasp, utilizar 21

    time.sleep(1)
    response = requests.get(google_drive_url)