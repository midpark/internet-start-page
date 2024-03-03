function closeHoverInfoBox() {
    document.querySelector("#hoverbox-info").style.display="none";
}

function openHoverInfoBox(name,tx,ty) {

    fetch(`subpages/${name}/main.html`, {
          method: 'GET',
          headers:
          {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => response.text())
        .then(data =>
        {
            if(data.substr(0,15)=="<!--INFOPAGE-->")
            {
                document.querySelector("#hoverbox-info-content").innerHTML=data;
                document.querySelector("#hoverbox-info").style.display="";
                document.querySelector("#hoverbox-info").style.top=`min(calc(100% - 400px), ${ty}px)`;
                document.querySelector("#hoverbox-info").style.left=`${tx}px`;
            }
        })
        .catch(error =>
        {
          document.getElementById('autosuggestion-picker-prim').style.display='none';
          //console.error(error);
        });


}

addEventListener("DOMContentLoaded", (event) => {
                html_ctp="";

                document.getElementById("db-def-search").focus();

                main_collection.forEach(item_i=>{
                    html_ctp+='<div class="mainwindow-bottom-section">';
                    html_ctp+=`<h1>${item_i.name}</h1>`;
                    item_i.list.forEach(item_j=>{
                        html_ctp+=
                        `<div class="mainwindow-bottom-section-item-cont" oncontextmenu="event.preventDefault(); openHoverInfoBox('${item_j.sitename}',event.clientX,event.clientY)">
                            <div class="mainwindow-bottom-section-item" title="${item_j.description}">
                                <img src="${item_j.iconpath}">
                                <a href="${item_j.href}"><span>${item_j.sitename}</span></a>
                            </div>
                        </div>`;
                    })

                    html_ctp+='</div>';
                })
                document.querySelector('.mainwindow-bottom').innerHTML=html_ctp;

                document.querySelector("#db-def-search-button").onclick=function() {
                    window.location="https://www.google.com/search?q="+document.querySelector("#db-def-search").value;
                }

                document.querySelector("#db-def-search").addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        document.querySelector("#db-def-search-button").onclick();
                    }
                });

                getWeatherInfo_OpenMeteo();

            });
