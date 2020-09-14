const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const message = document.querySelector(".top-banner .message");
const list = document.querySelector(".ajax-section .cities");

const api_key = "282d1678b343e848f2a98f766eb2dc72";

form.addEventListener("submit", e => {
    e.preventDefault();
    let input_val = input.value;

    //checking if there is already a city
    const list_items = list.querySelectorAll(".ajax-section .city");
    const list_items_array = Array.from(list_items);

    if(list_items_array.length > 0){
        const filtred_array = list_items_array.filter(element =>{
            let content = "";
            if(input_val.includes(",")){
                if(input_val.split(",")[1].length > 2){
                input_val = input_val.split(",")[0];
                content = element.querySelector(".city-name span").textContent.toLowerCase();
            }else{
                content = element.querySelector(".city-name").dataset.name.toLowerCase();
                }
            }else{
                content = element.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == input_val.toLowerCase();
        });

        if(filtred_array.length > 0){
            message.textContent = `You already know the weather for ${filtred_array[0].querySelector(".city-name span").textContent}.`;
              form.reset();
              input.focus();
              return;
        };
    };

    
    //ajax here 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${input_val}&appid=${api_key}&units=metric`;

    fetch(url).
        then(response => response.json()).
        then(data =>{
            const {main, name, sys, weather} = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
            
            const li = document.createElement("li");
            li.classList.add("city");
            
            const markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}
                <sup>°C</sup>
            </div>
            <figure>
                <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                <figcaption>${weather[0]["description"]}</figcaption>
             </figure>`;
            
            li.innerHTML = markup;
            list.appendChild(li); 
        }).
        catch(() =>{
            message.textContent = "Invalid city.";     
        });

    message.textContent = "";
    form.reset();
    input.focus();
});