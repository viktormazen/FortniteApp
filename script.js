$(document).ready(function () {

    let state = {
        weapons: null,
        filteredWeapons: null
    }
    function init() {
        $("#weaponFilterByRarity").hide();
    }
    init()

    function getDataFromFetch() {
        fetch("https://fortnite-api.theapinetwork.com/weapons/get", {
            headers: {
                authorization: "75129ef1af2b7ca047030412043412ae",
                "Overwrite-Version": "v2"
            }
        })
            .then(res => res.json())
            .then(data => {
                //console.log(data.data.entries)
                state.weapons = data.data.entries
                renderService.renderQuickWeapons(data.data.entries)
            })
    }
    getDataFromFetch();


    //Nav bar navigation
    function navbarNavigation() {
        $("#btnHome").on("click", function () {
            $("#weaponFilterByRarity").hide();
            $("#weaponFilterByRarity").hide();
            $("#bodyContainerHomeView").show()
            $(window).scrollTop(0);
        });

        $('#btnNews').click(() => {
            $("#weaponFilterByRarity").hide();
            $("#bodyContainerHomeView").show()
            $('html, body').animate({
                scrollTop: $('#newsDiv1').offset().top
            }, 500);
        });

        $('#btnChallenges').click(() => {
            $("#weaponFilterByRarity").hide();
            $("#bodyContainerHomeView").show()
            $('html, body').animate({
                scrollTop: $('#challengesDiv').offset().top
            }, 500);
        });

        $('#btnDailyStore').click(() => {
            $("#weaponFilterByRarity").hide();
            $("#bodyContainerHomeView").show()
            $('html, body').animate({
                scrollTop: $('#dailyStore').offset().top
            }, 500);
        });

        $('#btnUpcomingItems').click(() => {
            $("#weaponFilterByRarity").hide();
            $("#bodyContainerHomeView").show()
            $('html, body').animate({
                scrollTop: $('#upcomingItems').offset().top
            }, 500);
        });

        $('#btnRandomItems').click(() => {
            $("#weaponFilterByRarity").hide();
            $("#bodyContainerHomeView").show()
            $('html, body').animate({
                scrollTop: $('#randomItems').offset().top
            }, 500);
        });

        $("#dropdownMenuButton").on("click", function () {
            $("#bodyContainerHomeView").hide()
            $("#rarityDiv").hide()
            $("#weaponFilterByRarity").show();
            $("#stats").show()
            // renderService.renderQuickWeapons(state.weapons)
        })


        $("#commonFilter").on("click", function () {
            $("#bodyContainerHomeView").hide()
            $("#weaponFilterByRarity").show();
            let common = 'common'
            // let common = state.weapons.rarity = "common"
            renderService.printByRarity(common);
        })
        $("#uncommonFilter").on("click", function () {
            $("#bodyContainerHomeView").hide()
            let uncommon = "uncommon"
            renderService.printByRarity(uncommon);
        })
        $("#rareFilter").on("click", function () {
            $("#bodyContainerHomeView").hide()
            let rare = "rare"
            renderService.printByRarity(rare);
        })
        $("#epicFilter").on("click", function () {
            $("#bodyContainerHomeView").hide()
            let epic = "epic"
            renderService.printByRarity(epic);
        })
        $("#legendaryFilter").on("click", function () {
            $("#bodyContainerHomeView").hide()
            let legendary = "legendary"
            renderService.printByRarity(legendary);
        })

    };
    navbarNavigation();
    //Nav bar navigation


    //Compare code////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const dataService = {
        fillTable: (dataToFill) => {
            let tableData = ""
            for (const key in dataToFill) {
                tableData += 
                `<table class="table table-sm table-dark table-bordered">
                    <tr>
                        <td>${dataToFill[key].label} ${dataToFill[key].value ? dataToFill[key].value : 0}</td> 
                    </tr>
                </table>`
            }
            return tableData
        },
        weaponDataToRender: (data) => {
            return {
                name: data.name,
                image: data.image,
                // //backgroundImg: weapon.images.background,
                rarity: data.rarity,
                ammocost: data.stats.ammocost,
                damageBody: data.stats.hit_body,
                damageHead: data.stats.hit_head,
                magazineReload: data.stats.reloadtime,
                magazineSize: data.stats.magazinesize,
                dps: data.stats.dps,
                firerate: data.stats.firerate
            }
        }
    }

    function ajaxCall(url, processRes) {
        $.ajax({
            method: "GET",
            url: url,
            timeout: 0,
            headers: {
                "Authorization": "2f2aa0e10fe9f26d0d53ca458df6b418"
            },
            success: function (response) {
                processRes(response)
                //console.log(response)
            },
            error: function (response) {
                console.log('The request failed!');
                console.log(response.responseText);
            }
        });
    }

    $("#searchCompareDiv").hide();

    $("#searchBtn").on("click", function () {
        $("#searchCompareDiv").show();
        let input = $("#searchLabel").val();
        //api for username
        ajaxCall(`https://fortnite-api.theapinetwork.com/users/id?username=${input}`, (res) => {
            //api for id
            //console.log(res)
            if (res.data !== false || res.data === undefined) {
                try {
                    ajaxCall(`https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats?user_id=${res.data.uid}&platform=pc`, (resUid) => {
                        // console.log(res)
                        //console.log(resUid)                              
                        showuser(resUid)
                    })
                } catch (err) {
                    console.log(err);
                    $("#mainInfo").empty();
                    $("#mainInfo").append("Error 404 User Not Found. We are unable to find your profile. Please make sure your spelling is correct.");
                }
            }
        });
    });
    function showuser(user, isCompare) {
        //info for user
        //console.log(user);

        try {
            // info for lifetime
            function Lifetime(user) {
                /////console.log(user)
                this.kills = {
                    label: "Lifetime kills:",
                    value: user.totals.kills
                }
                this.wins = {
                    label: "Lifetime wins:",
                    value: user.totals.wins
                }
                this.matches = {
                    label: "Lifetime matches:",
                    value: user.totals.matchesplayed
                }
                this.killsDeath = {
                    label: "Lifetime K/D:",
                    value: user.totals.kd.toFixed(2)
                }
                this.winsInPercent = {
                    label: "Win% lifetime:",
                    value: user.totals.winrate.toFixed(2)
                }
            }

            function Solo(user) {
                if (user.stats.matchesplayed_solo === 0) {
                    this.nostats = {
                        label: "There are no stats for the Solo playlist.",
                        value: "Play some matches first!"
                    }
                }
                else {
                    this.matches = {
                        label: "Solo matchesplayed:",
                        value: user.stats.matchesplayed_solo
                    }
                    this.kills = {
                        label: "Solo kills:",
                        value: user.stats.kills_solo
                    }
                    this.wins = {
                        label: "Solo wins:",
                        value: user.stats.placetop1_solo
                    }
                    this.placetop10 = {
                        label: "Solo top 10:",
                        value: user.stats.placetop10_solo
                    }
                    this.placetop25 = {
                        label: "Solo top 25:",
                        value: user.stats.placetop25_solo
                    }

                    let death = this.matches.value - this.wins.value
                    let killsDeath = (this.kills.value / death)
                    let winsInPercent = (this.wins.value / this.matches.value) * 100
                    let soloKillsPerMatches = (this.kills.value / this.matches.value)

                    this.killsDeath = {
                        label: "Solo K/D:",
                        value: user.stats.kd_solo.toFixed(2)
                    }
                    this.winsInPercent = {
                        label: "Solo win%:",
                        value: user.stats.winrate_solo.toFixed(2)
                    }
                    this.soloKillsPerMatches = {
                        label: "Solo kills per match:",
                        value: soloKillsPerMatches ? soloKillsPerMatches.toFixed(2) : parseFloat("0.00").toFixed(2)
                    }
                }
            }

            function Duo(user) {
                if (user.stats.matchesplayed_duo === 0) {
                    this.nostats = {
                        label: "There are no stats for the Duo playlist.",
                        value: "Play some matches first!"
                    }
                }
                else {
                    this.matches = {
                        label: "Duo matchesplayed:",
                        value: user.stats.matchesplayed_duo
                    }
                    this.kills = {
                        label: "Duo kills:",
                        value: user.stats.kills_duo
                    }
                    this.wins = {
                        label: "Duo wins:",
                        value: user.stats.placetop1_duo
                    }
                    this.placetop5 = {
                        label: "Duo top 5:",
                        value: user.stats.placetop5_duo
                    }
                    this.placetop12 = {
                        label: "Duo top 12:",
                        value: user.stats.placetop12_duo
                    }

                    let duoKillsPerMatches = (this.kills.value / this.matches.value)

                    this.killsDeath = {
                        label: "Duo K/D:",
                        value: user.stats.kd_duo.toFixed(2)
                    }
                    this.winsInPercent = {
                        label: "Duo win%:",
                        value: user.stats.winrate_duo.toFixed(2)
                    }
                    this.duoKillsPerMatches = {
                        label: "Duo kills per match:",
                        value: duoKillsPerMatches ? duoKillsPerMatches.toFixed(2) : parseFloat("0.00").toFixed(2)
                    }
                }
            }

            function Squad(user) {
                if (user.stats.matchesplayed_squad === 0) {
                    this.nostats = {
                        label: "There are no stats for the Squad playlist.",
                        value: "Play some matches first!"
                    }
                }
                else {
                    this.matches = {
                        label: "Squad matchesplayed:",
                        value: user.stats.matchesplayed_squad
                    }
                    this.kills = {
                        label: "Squad kills:",
                        value: user.stats.kills_squad
                    }
                    this.wins = {
                        label: "Squad wins:",
                        value: user.stats.placetop1_squad
                    }
                    this.placetop3 = {
                        label: "Squad top 3:",
                        value: user.stats.placetop3_squad
                    }
                    this.placetop6 = {
                        label: "Squad top 6:",
                        value: user.stats.placetop6_squad
                    }

                    let squadKillsPerMatches = (this.kills.value / this.matches.value)

                    this.killsDeath = {
                        label: "Squad K/D:",
                        value: user.stats.kd_squad.toFixed(2)
                    }
                    this.winsInPercent = {
                        label: "Squad win%:",
                        value: user.stats.winrate_squad.toFixed(2)
                    }
                    this.squadKillsPerMatches = {
                        label: "Squad kills per match:",
                        value: squadKillsPerMatches ? squadKillsPerMatches.toFixed(2) : parseFloat("0.00").toFixed(2)
                    }
                }
            }

            const lifetime = new Lifetime(user)
            const solo = new Solo(user)
            const duo = new Duo(user)
            const squad = new Squad(user)

            const userInfo = `
    <h2><span id="${!isCompare ? 'nameMain' : 'nameCompare'}">${user.username.toUpperCase()}</span></h2>
    <table id="${!isCompare ? 'lifetimeMain' : 'lifetimeCompare'}">${dataService.fillTable(lifetime)}</table>
    <table id="${!isCompare ? 'soloMain' : 'soloCompare'}">${dataService.fillTable(solo)}</table>
    <table id="${!isCompare ? 'duoMain' : 'duoCompare'}">${dataService.fillTable(duo)}</table>
    <table id="${!isCompare ? 'squadMain' : 'squadCompare'}">${dataService.fillTable(squad)}</table>
  `
            if (!isCompare) {
                $("#mainInfo").empty();
                $("#mainInfo").append(userInfo)
            }
            else {
                $("#compareInfo").empty();
                $("#compareInfo").append(userInfo);
            }
        }

        catch (err) {
            console.log(err);
            if (!isCompare) {
                $("#mainInfo").empty();
                $("#mainInfo").append("404 Not Found. We are unable to find your profile. Please make sure your spelling is correct.");
            }
            else {
                $("#compareInfo").empty();
                $("#compareInfo").append("404 Not Found. We are unable to find your profile. Please make sure your spelling is correct.");
            }
        }
    }

    // for compare
    $("#compareLabel").hide();
    $("#compareBtn").hide();
    $("#compareLabelTwo").hide();
    $("#compareInfo").hide();
    $("#compare").on("click", function () {
        $("#compare").hide();
        $("#compareLabel").show();
        $("#compareBtn").show();
        $("#compareInfo").show();
    });

    $("#compareBtn").on("click", function () {
        //input for first table compare
        let input = $("#compareLabel").val();
        //api for username
        ajaxCall(`https://fortnite-api.theapinetwork.com/users/id?username=${input}`, (resCompare) => {
            //api for id
            //console.log(resCompare)

            if (resCompare.data !== false || resCompare.data === undefined) {
                try {
                    ajaxCall(`https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats?user_id=${resCompare.data.uid}&platform=pc`, (resUidCompare) => {
                        //console.log(resCompare)
                        //console.log(resUidCompare)
                        showuser(resUidCompare, true)
                    })
                } catch (err) {
                    //console.log(err);
                    $("#compareInfo").empty();
                    $("#compareInfo").append("404 Not Found. We are unable to find your profile. Please make sure your spelling is correct.");
                }
            }
        });
    });
    //Compare code////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    //Declare variables
    const authorization = "5bda47fe1fd86986cc6129e0f8da07f2";
    const upcomingItemsApi = "https://fortnite-api.theapinetwork.com/upcoming/get";
    const newsApi = "https://fortnite-api.theapinetwork.com/br_motd/get";
    const challengesApi = "https://fortnite-api.theapinetwork.com/challenges/get?season=current";
    const storeItemsApi = "https://fortnite-public-api.theapinetwork.com/prod09/store/get";

    //News call and Print Function/////////////////////////////////////////////////////////////////////////////////////////////////////

    function settingsNewsApi(api, auth) {
        var settingsNews = {
            "url": api,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": auth
            },
        };
        printDataNews(settingsNews);
    }

    settingsNewsApi(newsApi, authorization);

    //Print function
    function printDataNews(settingsNews) {
        $.ajax(settingsNews).done(function (response) {
            //console.log(response.data);
            for (let i = 0; i < 13; i++) {
                $(`#news${i}`).append(`
    <h5>${response.data[i].title}</h5>
    <img src="${response.data[i].image}" alt="news image 1" width="200" height="120"></br></br>
    <p>${response.data[i].body}</p>
    `);
            };
        });
    }

    //News call and Print Function/////////////////////////////////////////////////////////////////////////////////////////////////////




    //Challenges api call and Print function///////////////////////////////////////////////////////////////////////////////////////////

    function settingsChallengesApi(api, auth) {
        var settingsChallenges = {
            "url": api,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": auth
            },
        };
        printDataChallenges(settingsChallenges);
    };

    settingsChallengesApi(challengesApi, authorization);

    //Print function
    function printDataChallenges(settingsChallenges) {
        $.ajax(settingsChallenges).done(function (response) {
            let dataObj = response;
            // let season = dataObj.season;
            let currentWeek = dataObj.currentweek;
            let imageStar = dataObj.star;
            let challengesArray = dataObj.challenges;

            $("#dataDiv").prepend(`<img src="${imageStar}" alt="image star" width="80px" height=""><br><br>`);
            $("#tab").append(`
    <thead>
        <tr>
            <td><h4>Week</h4></td>
            <td><h4>Challenge</h4></td>
            <td><h4>Total</h4></td>
            <td><h4>Stars</h4></td>
            <td><h4>Difficility</h4></td>
        </tr>
    </thead>`);
            for (const key in challengesArray) {
                if (challengesArray.hasOwnProperty(key)) {
                    const element = challengesArray[key];
                    //console.log(element);
                    let week = element.week;
                    
                        element.entries.forEach(el =>
                            $("#tab").append(`
                    <tr>
                        <td>${week}</td>
                        <td>${el.challenge}</td>
                        <td>${el.total}</td>
                        <td>${el.stars}</td>
                        <td>${el.difficulty}</td>
                    </tr>`
                            ));
                    
                };
            };
        });
    };

    //Challenges api call and Print function///////////////////////////////////////////////////////////////////////////////////////////



    //Featured items call and Print function///////////////////////////////////////////////////////////////////////////////////////////

    async function getDataForStore() {
        let response = await fetch(storeItemsApi);
        let data2 = await response.json();
        printTableFeaturedItems(data2);
    };
    getDataForStore();

    function printTableFeaturedItems(data2) {
        $("#tab2").append(`
    <tr>
        <td colspan="6"><h4>Featured Items</h4></td>
    </tr>
    
    <tr>    
        <td><h4>#</h4></td>
        <td><h4>Name</h4></td>
        <td><h4>Rarity</h4></td>
        <td><h4>Type</h4></td>
        <td><h4>Cost</h4></td>
        <td><h4>Rating</h4></td>
    </tr>
  `);

        data2.items.filter(el1 => el1.featured == 1)
            .forEach(el => $("#tab2").append(`
    <tr>
        <td><img src="${el.item.image}" alt="img" width="75" height="75"><br>
            <td>${el.item.name}</td>
            <td>${el.item.rarity}</td>
            <td>${el.item.type}</td>
            <td><img src="${data2.vbucks}" alt="Bucks"  width="25" height="25"></img>${el.cost}</td>
        <td>${el.ratings.avgStars}</td>
    </tr>
  `));



        $("#tab3").append(`
  <tr>
    <td colspan="6"><h4>Daily Items<h4></td>
  </tr>
  
  <tr>    
    <td><h4>#</h4></td>
    <td><h4>Name</h4></td>
    <td><h4>Rarity</h4></td>
    <td><h4>Type</h4></td>
    <td><h4>Cost</h4></td>
    <td><h4>Rating</h4></td>
  </tr>
  `);

        data2.items.filter(el1 => el1.featured == 0)
            .forEach(el => $("#tab3").append(`
    <tr>
        <td><img src="${el.item.image}" alt="img" width="75" height="75"></td>
            <td>${el.item.name}</td><td>${el.item.rarity}</td>
            <td>${el.item.type}</td><td><img src="${data2.vbucks}" alt="Bucks"  width="25" height="25"> </img>${el.cost}</td>
        <td>${el.ratings.avgStars}</td>
    </tr>
  `));
    };
    //Featured items call and Print function///////////////////////////////////////////////////////////////////////////////////////////



    //Upcoming items call and Print function///////////////////////////////////////////////////////////////////////////////////////////



    function settingsUpcomingItemsApi(api, auth) {
        var settingsUpcomingItems = {
            "url": api,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": auth
            },
        };
        printUpcomingItems(settingsUpcomingItems);
    };

    settingsUpcomingItemsApi(upcomingItemsApi, authorization);

    //Upcoming items print function
    function printUpcomingItems(settingsUpcomingItems) {
        $.ajax(settingsUpcomingItems).done(function (response) {
            //console.log(response)
            for (let i = 0; i < 11; i++) {
                $(`#upcomingItems${i}`).append(`
      <img src="${response.data[i].item.images.information}" alt="image 1" width="150" height="150"></br>
      Rarity:${response.data[i].item.rarity}</br>
      Average stars: ${response.data[i].item.ratings.avgStars}</br>
      Type: ${response.data[i].item.type}
      `);
            };
        });
    };
    //Upcoming items call and Print function///////////////////////////////////////////////////////////////////////////////////////////




    //Dragana//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let renderService = {
        renderQuickWeapons: (data) => {
            for (const weapon of data) {
                renderService.printQuickCard(dataService.weaponDataToRender(weapon))
            }
        },

        printQuickCard: (data) => {
            $("#theadRarity").hide();
            $("#stats").append(() => renderService.newQuickCard(data));
        },
        newQuickCard: (data) => {
            let epicBgImg = "https://images.fabric.com/images/200/200/DZ-506.jpg";
            let legendaryBgImg = "https://ncscolour.com/wp-content/uploads/2016/04/tempcolorimg-1935.jpg";
            let commonBgImg = "https://sherwin.scene7.com/is/image/sw/color-swatch?_tparam_size=250,250&layer=comp&_tparam_color=7D848B";
            let uncommonBgImg = "https://www.colorcombos.com/images/colors/3A5F0B.png";
            let rareBgImg = "https://www.colorcombos.com/images/colors/1FBED6.png"

            if (data.rarity == "epic") {
                data.backgroundImg = epicBgImg;
            } else if (data.rarity == "legendary") {
                data.backgroundImg = legendaryBgImg;
            } else if (data.rarity == "common") {
                data.backgroundImg = commonBgImg;
            } else if (data.rarity == "uncommon") {
                data.backgroundImg = uncommonBgImg;
            } else if (data.rarity == "rare") {
                data.backgroundImg = rareBgImg;
            }

            $("#quickSort").on("click", function () {
                $(".sortByTable").hide();
                $(".quickSort").show();
            })

            $(".quickSort").append($(`
            <div class="card" style=" display: inline-block; padding: 10px;border:3px solid black; margin: 10px; width: 300px; height: 850px;">
        
                <ul class="list-group list-group-flush" style="padding-top: 200px;  list-style-type: none; ">
                    <li>
                    <img class="card-img-top" id="quickImg" style="width:200px; height:200px; z-index:2; top:0.5px;position:absolute; left:15%; " src="${data.image}" alt="" id="weaponimg">
                    </li>
                    <li>
                        <img class="card-img-top" style="z-index:1; top:0.5px;left:0.5px; position:absolute; height:210px;" src="${data.backgroundImg}" alt="" id="bgimg">
                    </li>
                    <li class="list-group-item">Damage Body: ${data.damageBody}</li>
                    <li class="list-group-item">Damage Head: ${data.damageHead}</li>
                    <li class="list-group-item">Rarity: ${data.rarity}</li>
                    <li class="list-group-item">Ammocost ${data.ammocost}</li>
                    <li class="list-group-item">Weapon Reload: ${data.magazineReload}</li>
                    <li class="list-group-item">Weapon Size: ${data.magazineSize}</li>
                    <li class="list-group-item">Damage per second: ${data.dps}</li>
                    <li class="list-group-item">Firerate: ${data.firerate}</li>
                    <li style="bottom: 5px">
                        <div class="card-body" style="text-align: center; font-size: 20px;bottom: 5px; position: absolute; width: 100%; left:0px;">
                            <h5 class="card-title" id="weaponName" style="text-align:center; color: rgb(0,0,0);" >${data.name}</h3>
                        </div>
                    </li>
                </ul>
            </div>`))
        },

        renderTableWeapons: (data) => {

            $(".sortByTable").show();
            $(".quickSort").hide();
            $("#bodytable").html("")

            for (const weapon of data) {
                let weaponToRender = dataService.weaponDataToRender(weapon)
                renderService.renderTableCard(weaponToRender)
            }
        },

        renderTableCard: (data) => {

            $("#bodytable").append($(`
        <tr>
            <th ><img style="width:80px; height:80px" scope="row" src="${data.image}" ></th>
            <td>${data.name}</td>
            <td>${data.rarity}</td>
            <td>${data.dps}</td>
            <td>${data.damageBody}</td>
            <td>${data.damageHead}</td>
            <td>${data.firerate}</td>
            <td>${data.magazineSize}</td>
            <td>${data.magazineReload}</td>
        </tr>
        
    </table>`))
        },
        printByRarity: (rarity) => {
            state.filteredWeapons = state.weapons.filter(w => w.rarity === rarity)
            renderService.renderTableWeapons(state.filteredWeapons)
        }
    }
    $("#theadRarity").hide();

    //Dragana//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

















});




