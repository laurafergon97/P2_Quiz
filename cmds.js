

const {log, biglog, errorlog, colorize}= require("./out");

const model = require('./model');


exports.helpCmd = rl => {
    log("Commandos:");
    log(" h|help - Muestra esta ayuda.");
    log(" list - Listar los quizzes existentes.");
    log(" show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log(" add - Añadir un nuevo quiz interactivamente.");
    log(" delete <id> - Borrar el quiz indicado.");
    log(" edit <id> - Editar el quiz indicado.");
    log(" test <id> - Probar el quiz indicado.");
    log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log(" credits - Créditos.");
    log(" q|quit - Salir del programa");
    rl.prompt();
};



exports.addCmd = rl => {
    rl.question(colorize('Introduzca una pregunta:', 'red'), question =>{
        rl.question(colorize('Introduzca la respuesta ','red'), answer =>{
            model.add(question, answer);
            log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=> ','magenta')}${answer}`);
            rl.prompt();
        })
    });
};

exports.listCmd = rl => {
    model.getAll().forEach((quiz,id)=>{
        log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};

exports.deleteCmd = (rl, id) => {
     if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
     }else{
        try{
            model.deleteByIndex(id);
        }catch(error){
            errorlog(error.message);
        }
     }
     rl.prompt();
};

exports.testCmd = (rl, id) => {
    if (typeof id ==="undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);
            rl.question(colorize(quiz.question + '? ','red'), answer =>{
                // Invocamos a un metodo escrito por nosotras para no discriminar mayusculas ni minusculas ni espacios
                let answer1 = adecuaText(answer);
                let resp_quizz1 = adecuaText(quiz.answer);
                if(answer1 === resp_quizz1){
                    log('Su respuesta es correcta.');
                    biglog('Correcta','green');
                }else{
                    log('Su respuesta es incorrecta.');
                    biglog('Incorrecta','red');
                }
                rl.prompt();
            });     
        }catch(error){
            errorlog(error.message);
            rl.prompt();
        }

    }

};

exports.playCmd = rl => {
    //inicializamos el contador 
    let score = 0;
    let toBeResolved = [];

    for(i = 0; i<model.count(); i++){
        toBeResolved[i] = model.getByIndex(i);
    }
    // hacemos un for para obtener los ids de las preguntas 
    const playOne = () =>{
        if(toBeResolved.length === 0){
            log('No hay nada más que preguntar.');
            log(`Fin del juego. Aciertos: ${colorize(score, 'black')}`);
            biglog(score,'magenta');
            rl.prompt();
        }else{
            
            let id = Math.round(Math.random()*(toBeResolved.length-1));
            let quiz = toBeResolved[id];
            toBeResolved.splice(id,1);
            rl.question(colorize(quiz.question + '? ','red'), answer =>{
                // Invocamos a un metodo escrito por nosotras para no discriminar mayusculas ni minusculas ni espacios
                let answer1 = adecuaText(answer);
                let resp_quizz1 = adecuaText(quiz.answer);
                //log(answer1);
                //log(resp_quizz1);
                if(answer1 === resp_quizz1){
                    score++;
                    log(`CORRECTO - Lleva ${colorize(score, 'black')} aciertos`);
                    playOne();
                }else{
                    log("INCORRECTO.")
                    log(`Fin del juego. Aciertos: ${score}`);
                    biglog(score,'magenta');
                    rl.prompt();
                }
                
            });     
            

        }
    }
    playOne();
};

exports.showCmd = (rl, id) => {
    if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
     }else{
        try{
            const quiz = model.getByIndex(id);
            log(`[${colorize(id, 'magenta')}] : ${quiz.question} ${colorize(' => ', 'magenta')} ${quiz.answer}`);
        }catch(error){
            errorlog(error.message);
        }
     }
     rl.prompt();
};
    

exports.editCmd = (rl, id) => {
    if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(()=> {rl.write(quiz.question)},0);
            rl.question(colorize('Introduzca una pregunta: ', 'red'), question =>{
                process.stdout.isTTY && setTimeout(()=> {rl.write(quiz.answer)},0);
                rl.question(colorize('Introduzca la respuesta ', 'red'), answer =>{
                    model.update(id,question,answer);
                    log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question}${colorize(' =>', 'magenta')} ${answer}`);
                        rl.prompt();
                });
            });
        }catch(error){
            errorlog(error.message);
            rl.prompt();
        }

    }

};

exports.creditsCmd = rl => {
    log('Autores de la práctica:');
    log('Paula García Fernández','green');
    log('Laura Fernández González','green');
    rl.prompt();
};	

exports.quitCmd =rl => {
     rl.close();
     rl.prompt();
};

adecuaText = function(texto){
    let respuesta = texto.split("");
    let textoFinal = [];
    for(j = 0; j<texto.length; j++){
    	textoFinal[j]=respuesta[j].toLowerCase().trim();
    }
    
    return textoFinal;
}
