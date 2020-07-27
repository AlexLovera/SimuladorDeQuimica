import json
import wikipediaapi

def modificarPartesJsonAEsp():
    # va a modificar el resumen de los elemntos, el link a wiki, y el nombre del elemento
    wiki_wiki = wikipediaapi.Wikipedia(language='en')

    with open("datosDeElementos.json", "r") as archivo:
        dic_datos_recuperados = json.load(archivo)
        for elemento in dic_datos_recuperados['elements']:
            page_py = wiki_wiki.page(elemento["name"])
            if page_py.exists():
                pagina_en_español = page_py.langlinks["es"]
                resumen = wiki_wiki.extracts(pagina_en_español, exsentences=2)
                nombre_elemento_esp = pagina_en_español.title
                url_esp = pagina_en_español.fullurl
                # cambio los valores del json
                elemento['summary'] = resumen
                elemento['source'] = url_esp
                elemento['name'] = nombre_elemento_esp

    if dic_datos_recuperados:
        with open("datosDeElementosEspaniol.json", "w",encoding="utf-8") as nuevoArch:
            json.dump(dic_datos_recuperados,nuevoArch)

modificarJsonAEspa()