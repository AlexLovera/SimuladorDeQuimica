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

#modificarJsonAEspa()

def devolverGrupoCorrectoMediantePeriodo(posicionXElemento,posicionYElemento):
    GRUPO_PARA_LANTANIDOS_ACTINIDOS=3
    PERIODO_LANTINIDOS_MAL=9
    PERIODO_ACTINIDOS_MAL=10
    if posicionXElemento == PERIODO_LANTINIDOS_MAL or posicionXElemento == PERIODO_ACTINIDOS_MAL:
        return GRUPO_PARA_LANTANIDOS_ACTINIDOS
    else :
        return posicionYElemento


def verificarPeriodo(periodoRecib):
    POSIBLE_EXCEDENTE_PERIODO= 3
    if periodoRecib >= 9 :
        return periodoRecib - POSIBLE_EXCEDENTE_PERIODO
    else :
        return periodoRecib


def agregarNumeracionPorGrupo(grupoRecib):
    dic_notacion_IUPAC_a_EEUU={"1":"IA","2":"IIA","3":"IIIB","4":"IVB","5":"VB","6":"VIB","7":"VIIB","8":"VIIIB","9":"VIIIB","10":"VIIIB","11":"IB","12":"IIB","13":"IIIA","14":"IVA","15":"VA","16":"VIA","17":"VIIA","18":"VIIIA"}
    return str(grupoRecib) +" ("+ dic_notacion_IUPAC_a_EEUU[grupoRecib]+" -> notacion EEUU)"

def agregarGrupoYPeriodo():
    with open("datosDeElementosEspaniol.json", "r") as archivo:
        dic_datos_recuperados = json.load(archivo)
        for elemento in dic_datos_recuperados['elements']:
            elemento["grupo"] = str(devolverGrupoCorrectoMediantePeriodo(elemento["ypos"],elemento["xpos"]))
            # agrego info al grupo
            elemento["grupo"] = agregarNumeracionPorGrupo(elemento["grupo"])

        with open("datosDeElementosConExtra.json", "w", encoding="utf-8") as nuevoArch:
            json.dump(dic_datos_recuperados, nuevoArch)

#def agregarBloque(grupoRecib):

agregarGrupoYPeriodo()
