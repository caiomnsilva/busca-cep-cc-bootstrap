$("#cidades").hide()

function buscaCep() {
	cep = document.getElementById("cep").value
	result = document.getElementById("result")
	fetch(`https://viacep.com.br/ws/${cep}/json/`)
		.then((res) => { return res.json() })
		.then((cep) => { result.innerHTML = mountList(cep) })
}

function buscaUF() {
	fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
		.then((res) => { return res.json() })
		.then((ufs) => { 
			list = "<option selected>Selecione o estado</option>"
			for(let uf of ufs){
				list += `<option value="${uf.id}-${uf.sigla}">${uf.nome}</option>`
			}
			$("#ufs").html(list)
		})
}

buscaUF()

function mudaUF(e){
	uf = e.target.value.split("-")[0]
fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
		.then((res) => { return res.json() })
		.then((cidades) => {
      list = "<option selected>Selecione a cidade</option>"
			for(let cidade of cidades){
				list += `<option value="${cidade.nome}">${cidade.nome}</option>`
			}
			$("#cidades").html(list)})
  $("#cidades").show()
}



function limparResultado(){
	result = document.getElementById("result")
	result.innerHTML = ""

  titulo = $("#titulo").text()
  if (titulo == "Buscar por RUA"){
    $("#titulo").text("Buscar por CEP")
  }else{
    $("#titulo").text("Buscar por RUA")
  }
}

function buscaRua() {
	estado = document.getElementById("ufs").value.split("-")[1]
	municipio = document.getElementById("cidades").value.trim()
	rua = document.getElementById("rua").value
	result = document.getElementById("result")
  
	fetch(`https://viacep.com.br/ws/${estado}/${municipio}/${rua}/json/`)
		.then((res) => { return res.json() })
    .then((ceps) => {
      // Verificar se o retorno está vazio ou não tem logradouro
      if (!ceps || !ceps[0] || !ceps[0].logradouro) {
        result.innerHTML = `<div class="card" style="width: 100%;">
            <h3 style="text-align: center">Rua não encontrada</h3>
            </div>`;
      } else {
        result.innerHTML = mountListRuas(ceps);
      }
    })
}

function mountList(cep) {
	list = ""

	list = `
			<div class="card" style="width: 100%;">
  			<ul class="list-group list-group-flush">
    			<li class="list-group-item">${cep.logradouro}</li>
    			<li class="list-group-item">${cep.localidade}</li>
    			<li class="list-group-item">${cep.bairro}</li>
    			<li class="list-group-item">${cep.uf}</li>
  			</ul>
			</div>
		`
	return list
}


function mountListRuas(ceps) {
	list = []
	for(let cep of ceps){
      list.push(`
			<div class="card" style="width: 100%;">
  			<ul class="list-group list-group-flush">
    			<li class="list-group-item">${cep.logradouro}</li>
    			<li class="list-group-item">${cep.cep}</li>
    			<li class="list-group-item">${cep.localidade}</li>
    			<li class="list-group-item">${cep.bairro}</li>
    			<li class="list-group-item">${cep.uf}</li>
  			</ul>
			</div><br>
		`)
    }
	return list.toString().replaceAll(",","")
  }



