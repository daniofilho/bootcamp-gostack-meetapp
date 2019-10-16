# Mobile - Meetapp

**Importante**: Este projeto foi desenvolvido e testado exclusivamente usando o emulador do Android Studio. Para evitar erros de URL, foi criando um arquivo dentro de `/util` chamado `urlMiddleware.js` que verifica se está em ambiente de desenvolvimento Android e faz a conversão de URLs. Esta funcionalidade não foi testada usando um celular Android, apenas usando emulador (uso Linux, mas tenho iPhone).

Este projeto foi desenvolvido utilizando **Yarn** então é importante ter essa ferramenta instalada na máquina antes de continuar.

https://yarnpkg.com/lang/en/

---

Antes, certifique-se de que o Back End está rodando, assim como o emulador Android.

Comandos para executar:

`yarn start` em uma aba do terminal

`yarn react-native run-android` em outra, apenas na primeira vez

Se estiver com Android Emulator, rode o comando abaixo para fazer o redirecionamento de portas

`adb reverse tcp:9090 tcp:9090`
