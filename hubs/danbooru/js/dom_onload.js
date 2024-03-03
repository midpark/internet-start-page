function checkInfoString() {
    fetch("https://danbooru.donmai.us/counts/posts.json",{method: 'GET'})
    .then(response => response.json())
    .then(data => {
        document.querySelector('.mainwindow-top-status').innerHTML=`Danbooru is running with ${abbreviateNumber(data.counts.posts)} posts`;
    })
    .catch(error =>
    {
        document.querySelector('.mainwindow-top-status').innerHTML=(`Cannot connect to Danbooru`);
    });
}

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

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

function getLocSP12() {
    cursor_location=document.querySelector("#db-def-search").selectionStart;
    loc_sp2=document.querySelector("#db-def-search").value.indexOf(' ', cursor_location);
    if(loc_sp2==-1)
    {
        loc_sp2=loc_sp2=document.querySelector("#db-def-search").value.length;
    }
    loc_sp1=document.querySelector("#db-def-search").value.slice(0,loc_sp2).lastIndexOf(' ');
    if(loc_sp1==-1)
    {
        loc_sp1=0;
    }
    else
    {
        loc_sp1++;
    }
    return {loc_sp1,loc_sp2};
}

function getStrBetweenSpaces() {
    return document.querySelector("#db-def-search").value.substring(getLocSP12().loc_sp1,getLocSP12().loc_sp2);

}

function setCursorPosition(input, pos) {
    if (input.setSelectionRange) {
      input.focus(); // Focus the input element first
      input.setSelectionRange(pos, pos);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

addEventListener("DOMContentLoaded", (event) => {
                checkInfoString();
                html_ctp="";

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
                    window.location="https://danbooru.donmai.us/posts?tags="+document.querySelector("#db-def-search").value;
                }

                document.querySelector("#db-def-search").addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        document.querySelector("#db-def-search-button").onclick();
                    }
                });



                function pasteFromAutoSuggestions() {

                    if (Array.from(document.querySelectorAll(".autosuggestions-picker-item-selected")).length==0 && Array.from(document.querySelectorAll(".autosuggestions-picker-item")).length>0)
                    {
                        schbar_text=document.querySelector("#db-def-search").value;
                        tag_n=document.querySelectorAll(".autosuggestions-picker-item")[0].querySelector(".autosuggestions-picker-item-title").innerHTML;
                        document.querySelector("#db-def-search").value=schbar_text.substring(0,getLocSP12().loc_sp1) + tag_n + schbar_text.substring(getLocSP12().loc_sp2,schbar_text.length) + " ";
                        setCursorPosition(document.querySelector("#db-def-search"),getLocSP12().loc_sp2);
                    }
                    if (Array.from(document.querySelectorAll(".autosuggestions-picker-item-selected")).length==1 && Array.from(document.querySelectorAll(".autosuggestions-picker-item")).length>0)
                    {
                        schbar_text=document.querySelector("#db-def-search").value;
                        tag_n=document.querySelectorAll(".autosuggestions-picker-item-selected")[0].querySelector(".autosuggestions-picker-item-title").innerHTML;
                        document.querySelector("#db-def-search").value=schbar_text.substring(0,getLocSP12().loc_sp1) + tag_n + schbar_text.substring(getLocSP12().loc_sp2,schbar_text.length) + " ";
                        setCursorPosition(document.querySelector("#db-def-search"),getLocSP12().loc_sp2);
                    }
                    schbar_text=document.querySelector("#db-def-search").focus();
                    document.querySelector("#autosuggestions-picker").style.display="none";
                }

                function selectAutoSuggItem(indx) {
                    Array.from(document.querySelectorAll(".autosuggestions-picker-item")).forEach(item => {
                        item.classList.remove("autosuggestions-picker-item-selected");
                    })

                    len=Array.from(document.querySelectorAll(".autosuggestions-picker-item")).length;
                    Array.from(document.querySelectorAll(".autosuggestions-picker-item"))[indx % len].classList.add("autosuggestions-picker-item-selected");
                }

                curr_select=-1;
                document.querySelector("#db-def-search").addEventListener("keydown", function(event) {
                    if (event.key === "Tab") {
                        event.preventDefault();
                        pasteFromAutoSuggestions();
                    }
                    if (event.key === "ArrowUp") {
                        event.preventDefault();

                        if(curr_select==0)
                        {
                            curr_select=Array.from(document.querySelectorAll(".autosuggestions-picker-item")).length-1;
                        }
                        else
                        {
                            curr_select--;
                        }
                        selectAutoSuggItem(curr_select);

                        console.log("yes");
                    }
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        curr_select++;
                        if(curr_select==Array.from(document.querySelectorAll(".autosuggestions-picker-item")).length)
                        {
                            curr_select=0;
                        }
                        selectAutoSuggItem(curr_select);
                        console.log("no");

                    }
                });

                document.querySelector("#db-def-search").addEventListener("blur",function(event) {
                    document.querySelector("#autosuggestions-picker").style.display="none";
                    curr_select=-1;
                })

                document.querySelector("#db-def-search").addEventListener("input",function(event) {
                    if(getStrBetweenSpaces()!="")
                    {
                        fetch(`https://danbooru.donmai.us/tags.json?search[order]=count&search[name_matches]=${encodeURI(getStrBetweenSpaces())}*`, {
                            method: 'GET'
                        })
                        .then(response => response.json())
                        .then(data =>
                        {
                            document.querySelector("#autosuggestions-picker").style.display="";
                            document.querySelector("#autosuggestions-picker").style.left=document.querySelector("#db-def-search").getBoundingClientRect().x+"px";
                            document.querySelector("#autosuggestions-picker").style.top=(document.querySelector("#db-def-search").getBoundingClientRect().y+40)+"px";
                            document.querySelector("#autosuggestions-picker").style.width=document.querySelector("#db-def-search").getBoundingClientRect().width+"px";


                            html_topaste="";
                            data.slice(0, 6).forEach(item => {
                                html_topaste+=`
                                <div class="autosuggestions-picker-item">
                                    <img src="${'img/tagicons/' + item.name + '.avif'}" onerror="this.style.opacity=0">
                                    <span class="autosuggestions-picker-item-title">${item.name}</span>
                                    <span class="autosuggestions-picker-item-caption">${abbreviateNumber(item.post_count)}</span>
                                </div>
                                `;
                            })
                            //console.log(html_topaste);
                            document.querySelector('#autosuggestions-picker').innerHTML=html_topaste;
                        })
                        .catch(error =>
                        {
                            console.error(error);
                        });
                    }
                    else
                    {
                        document.querySelector("#autosuggestions-picker").style.display="none";
                    }

                })

            });
