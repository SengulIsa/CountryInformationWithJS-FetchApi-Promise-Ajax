const btnSearch=document.querySelector('#btnSearch');
const txtSearch=document.querySelector('#txtSearch');

btnSearch.addEventListener('click',function(){
    let countryName= txtSearch.value; 
    document.querySelector("#details").style.opacity=0;

    getCountry(countryName);
    });

   function getCountry(country){
    fetch('https://restcountries.com/v3.1/name/'+ country)
    .then((response)=>{
        if(!response.ok){
            throw new Error("Country not found");
        }
        return response.json()
    })
    .then((data)=>{
        renderCountry(data[0]);
        const countries = data[0].borders;
            if(!countries)
            throw  new Error("Neighbour countries not found");

        return fetch('https://restcountries.com/v3.1/alpha?codes='+ countries.toString())
    })
        .then((response)=>response.json())
        .then((data)=>renderNeighbours(data))
        .catch((err)=> renderError(err));
   }

     function renderCountry(data){   
        document.querySelector("#country-details").innerHTML="";
        const tag=`
            <div>
                ${data.name.common} has not a neighbour country !
            </div>
        
        `;
        document.querySelector("#neighbours").innerHTML=tag;

        let html=`
                    <div class="col-4">
                        <img src="${data.flags.png}" alt="img-fluid">
                    </div>
                    <div class="col-8">
                        <h3 class="card-title">${data.name.common}</h3>
                        <hr>
                        <div class="row">
                            <div class="col-4">Population:</div>
                            <div class="col-8">${(data.population/1000000).toFixed(1)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Language:</div>
                            <div class="col-8">${Object.values(data.languages)}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Capital City:</div>
                            <div class="col-8">${data.capital[0]}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">Currency:</div>
                            <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                        </div>

                    </div>
        `;
        
        document.querySelector("#details").style.opacity=1;
         document.querySelector("#country-details").innerHTML= html;
    }

    function renderNeighbours(data){
        let html="";
        for(let country of data){
             html +=`
            <div onclick="clickNeighboursCountry()" class="col-2 mt-2">
                <div class="card">
                    <img src="${country.flags.png}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title neighbours-title">${country.name.common}</h6>
                    </div>
                    <button class="btn  btn-info">Get Information</button>
                </div>
            </div>

        `;

        }
      
        document.querySelector("#neighbours").innerHTML=html;
        
    };

     function clickNeighboursCountry()
     {  
        txtSearch.value=document.querySelector(".neighbours-title").textContent;   // This function just work for first neighbour country(we want to all neighbour but not work now)
          getCountry(txtSearch.value);

     
    }
 
    function renderError(err){
        const html=`
            <div class="alert alert-warning">
                ${err.message}
            </div>
        
        `;
        setTimeout(function(){
            document.querySelector('#errors').innerHTML="";
        },3000)
        document.querySelector('#errors').innerHTML=html
    }