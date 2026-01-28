document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("loggedInUser");
    let adminEmails = ["teksek.dev@proton.me", "admin@admin.me"];

    if (!user) {
        window.location.href = "../index.html"; // jeśli brak użytkownika, wracamy do logowania
    } else {
        user = JSON.parse(user);
        document.getElementById("welcomeMessage").innerText = "Welcome, " + user.email;
        let signUpButton = document.querySelector(".nav_buttons > :last-child > a");
        signUpButton.innerText = user.email.split("@")[0];
        signUpButton.setAttribute('href', "#");
    }

    if(adminEmails.includes(user.email)) {
        let mainElement = document.querySelector(".dashboard");

        let historySection = document.createElement('div');
        historySection.classList.add("dashboard_section");

        let historyH2Element = document.createElement('h2');
        historyH2Element.innerText = "📜 Historia wypożyczeń";

        let historyPElement = document.createElement('p');
        historyPElement.innerText = "Kto i kiedy korzystał z danego narzędzia.";

        historySection.appendChild(historyH2Element);
        historySection.appendChild(historyPElement);
        historySection.setAttribute("data-section", "history")
        mainElement.appendChild(historySection);

        let adminSection = document.createElement('div');
        adminSection.classList.add("dashboard_section");

        let h2Element = document.createElement('h2');
        h2Element.innerText = "🛠️ Panel administracyjny";

        let pElement = document.createElement('p');
        pElement.innerText = "Zarządzaj sprzętem i zatwierdzaj rezerwacje.";

        adminSection.appendChild(h2Element);
        adminSection.appendChild(pElement);
        adminSection.setAttribute("data-section", "admin")
        mainElement.appendChild(adminSection);
    }

    const sections = document.querySelectorAll(".dashboard_section");
    const dashboard = document.getElementById("dashboard");
    const contentSection = document.getElementById("content");
    const dynamicContent = document.getElementById("dynamicContent");

    sections.forEach(section => {
        section.addEventListener("click", () => {
            const sectionName = section.getAttribute("data-section");
            showSection(sectionName);
        });
    });

    function showSection(sectionName) {
        dashboard.classList.add("hidden");
        contentSection.classList.remove("hidden");

        let contentHTML = "";

        if (sectionName === "items") {
            contentHTML = `<h2 style='position: absolute; top: 20px;'>📋 Lista sprzętu</h2>
                            <button id="back" class="button" style='position: absolute; top: 20px; left: 20px;'>🔙 Powrót</button>`;
            let items = localStorage.getItem('items');
            items = JSON.parse(items); 
            let itemsHTML = "";

            if(items != null) {
                document.querySelector('#dynamicContent').classList.add("flex-direction-column");
                for(let item of items) {
                    if(item["reserved"] === true) {
                        continue;
                    }
                    let itemDescription = item.description.includes("\n");
                    if(itemDescription) {
                        let occurenceNumber = (item.description.match(item.description, "\n") || []).length; 
                        // console.log(occurenceNumber);
                        for(let i = 0; i < occurenceNumber; i++) {
                            itemDescription = item.description.replace("\n", '<br>');
                        }
                    } else {
                        itemDescription = item.description;
                    }
                    // console.log(itemDescription);
                    itemsHTML += `<div class='item_block'>
                                        <div>
                                            <h5>${item.name}</h5>
                                            <p>${itemDescription}</p>
                                        </div>
                                        <div>
                                            <img src=${item.imgPath} alt='photo of ${item.name}' width="300px" height="300px" style='object-fit: contain;'>
                                            <button class='button reservationButton' data-id='${item.id}'>Rezerwuj</button>
                                        </div>
                                    </div>`;
                                    
                }
            } else if (items === null) {
                itemsHTML += `<div style='display: flex; flex-direction: column; align-items: center;'><h3>Brak narzędzi!</h3>
                                <span>Wszystkie zostały zarezerwowane lub nie mamy żadnych w systemie!</span></div>`;
            }

            let everythingReserved = false;
            if(itemsHTML === "") {
                for(let item of items) {
                    if(item["reserved"]) {
                        everythingReserved = true;
                    } else if (!(item['reserved'])) {
                        everythingReserved = false;
                        return;
                    }
                }
                if(everythingReserved) {
                    itemsHTML += `<div style='display: flex; flex-direction: column; align-items: center;'><h3>Brak narzędzi!</h3>
                                    <span>Wszystkie zostały zarezerwowane lub nie mamy żadnych w systemie!</span></div>`;
                }
            }
            contentHTML += itemsHTML;
        } else if (sectionName === "reservations") {
            contentHTML = `<h2 style='position: absolute; top: 20px;'>🔒 Moje rezerwacje</h2>
                            <button id="back" class="button" style='position: absolute; top: 20px; left: 20px;'>🔙 Powrót</button>`;
            let reservations = localStorage.getItem('reservations');
            reservations = JSON.parse(reservations);
            let loggedInUser = localStorage.getItem("loggedInUser");
            loggedInUser = JSON.parse(loggedInUser);
            if(reservations != null) {
                document.querySelector('#dynamicContent').classList.add("flex-direction-column");
                for(let reservation of reservations) {
                    let items = localStorage.getItem('items');
                    items = JSON.parse(items);
                    for(let item of items) {
                        if(reservation["itemID"] == item["id"] && reservation["userEmail"] == loggedInUser["email"]) {
                            let itemDescription = item.description.includes("\n");
                            if(itemDescription) {
                                let occurenceNumber = (item.description.match(item.description, "\n") || []).length; 
                                // console.log(occurenceNumber);
                                for(let i = 0; i < occurenceNumber; i++) {
                                    itemDescription = item.description.replace("\n", '<br>');
                                }
                            } else {
                                itemDescription = item.description;
                            }
                            // console.log(itemDescription);
                            contentHTML += `<div class='item_block'>
                                                <div>`;
                            if(reservation["pending"])
                                contentHTML += `<h5>${item.name} - <span style='font-weight: normal; text-decoration: underline;'>Oczekuje na zatwierdzenie przez administratora</span></h5>`;             
                            else if (!reservation["pending"])
                                contentHTML += `<h5>${item.name} - <span style='font-weight: normal; text-decoration: underline;'>Zarezerwowane przez Ciebie dnia ${reservation["date"]}</h5>`;
                            contentHTML += `<p>${itemDescription}</p>
                                                </div>
                                                <div>
                                                    <img src=${item.imgPath} alt='photo of ${item.name}' width="300px" height="300px" style='object-fit: contain;'>`;
                            if(reservation["pending"]) 
                                contentHTML += `<button class='button reservationButton' data-id='${item.id}'>Anuluj rezerwację</button>`;
                            else if (!reservation["pending"])
                                contentHTML += `<button class='button reservationButton' data-id='${item.id}'>Zwróć sprzęt</button>`;
                            contentHTML += `    </div>
                                            </div>`;
                        }
                    }
                }
            } else if (reservations === null) {
                contentHTML += `<div style='display: flex; flex-direction: column; align-items: center;'><h3>Brak rezerwacji!</h3>
                                <p>Aktualnie nie masz żadnych rezerwacji.</p>`;
            } 
            if (Array.isArray(reservations) && reservations.length === 0) {
                contentHTML += `<div style='display: flex; flex-direction: column; align-items: center;'><h3>Brak rezerwacji!</h3>
                                <p>Aktualnie nie masz żadnych rezerwacji.</p>`;
            }
        } else if (sectionName === "history") {
            let reservations = localStorage.getItem('reservations');
            reservations = JSON.parse(reservations);

            contentHTML = `<h2 style='position: absolute; top: 20px;'>📜 Historia wypożyczeń</h2>
                            <button id="back" class="button" style='position: absolute; top: 20px; left: 20px;'>🔙 Powrót</button>`;
            if(reservations != null) {
                document.querySelector('#dynamicContent').classList.add("flex-direction-column");
                let reservationHTML = "";
                for(let reservation of reservations) {
                    if(reservation["pending"] === false) {
                        let items = localStorage.getItem('items');
                        items = JSON.parse(items);
                        for(let item of items) {
                            if(reservation["itemID"] == item["id"]) {
                                let itemDescription = item.description.includes("\n");
                                if(itemDescription) {
                                    let occurenceNumber = (item.description.match(item.description, "\n") || []).length; 
                                    for(let i = 0; i < occurenceNumber; i++) {
                                        itemDescription = item.description.replace("\n", '<br>');
                                    }
                                } else {
                                    itemDescription = item.description;
                                }
                                reservationHTML += `<div class='item_block'>
                                                    <div>
                                                        <h5>${item.name} - <span style='font-weight: normal; text-decoration: underline;'>Zarezerwowane ${reservation["date"]} przez ${reservation["userEmail"]}</span></h5>
                                                        <p>${itemDescription}</p>
                                                    </div>
                                                    <div>
                                                        <img src=${item.imgPath} alt='photo of ${item.name}' width="300px" height="300px" style='object-fit: contain;'>
                                                    </div>
                                                </div>`;
                            }
                        }
                    }
                }
                if(reservationHTML === "") {
                    contentHTML += `<p>Aktualnie nie ma żadnych rezerwacji w historii.</p>`;
                } else if (reservationHTML != "")
                    contentHTML += reservationHTML;
            } else if (reservations === null) {
                contentHTML += `<p>Aktualnie nie ma żadnych rezerwacji w historii.</p>`;
            }
        } else if (sectionName === "admin") {
            if(document.querySelector('#dynamicContent').classList.contains("flex-direction-column")) {
                document.querySelector('#dynamicContent').classList.remove("flex-direction-column");
            }
            let reservations = localStorage.getItem('reservations');
            reservations = JSON.parse(reservations)
            contentHTML = `<h2 style='position: absolute; top: 20px;'>🛠️ Panel administracyjny</h2>
                            <button id="back" class="button" style='position: absolute; top: 20px; left: 20px;'>🔙 Powrót</button>
                            <div style='width: 50%' id='addItemDiv'>
                                <h3>Dodaj sprzęt</h3>
                                <div style='margin-top: 20px;'>   
                                    <div class='formDiv'>
                                        <span>Nazwa sprzętu</span>
                                        <input type='text' class='formInput' size=50 id='itemName'>
                                    </div>
                                    <div class='formDiv' style='margin-top: 10px;'>
                                        <span>Opis sprzętu</span>
                                        <textarea class='formInput' max-width='200px' style='resize: none;' cols=100 rows=20 id='itemDescription'></textarea>
                                    </div>
                                    <div class='formDiv' style='margin-top: 10px;'>
                                        <span>Lokalizacja zdjęcia</span>
                                        <input type='text' class='formInput' size=50 id='itemImgPath'>
                                    </div>
                                    <div class='formDiv' style='margin-top: 10px;'>
                                        <button class='button' id='addItem'>Dodaj sprzęt</button>
                                    </div>
                                </div>
                            </div>
                            <div style='width: 50%' id='aproveReservation'>
                                <h3 style='margin-bottom: 15px;'>Potwierdź rezerwację sprzętu</h3>`;
            if(reservations != null) {
                let reservationHTML = "";
                for(let reservation of reservations) {
                    if(reservation["pending"] === true) {
                        let items = localStorage.getItem('items');
                        items = JSON.parse(items);
                        for(let item of items) {
                            if(reservation["itemID"] == item["id"]) {
                                let itemDescription = item.description.includes("\n");
                                if(itemDescription) {
                                    let occurenceNumber = (item.description.match(item.description, "\n") || []).length; 
                                    // console.log(occurenceNumber);
                                    for(let i = 0; i < occurenceNumber; i++) {
                                        itemDescription = item.description.replace("\n", '<br>');
                                    }
                                } else {
                                    itemDescription = item.description;
                                }
                                // console.log(itemDescription);
                                reservationHTML += `<div class='item_block' style='margin-top: 10px;'>
                                                    <div>
                                                        <h5>${item.name} - <span style='font-weight: normal; text-decoration: underline;'>Oczekuje na zatwierdzenie przez administratora</span></h5>
                                                        <p>${itemDescription}</p>
                                                    </div>
                                                    <div>
                                                        <img src=${item.imgPath} alt='photo of ${item.name}' width="300px" height="300px" style='object-fit: contain;'>
                                                        <button class='button reservationButton' data-id='${item.id}'>Zatwierdź rezerwację</button>
                                                    </div>
                                                </div>`;
                            }
                        }
                    }
                }
                if(reservationHTML === "") {
                    contentHTML += `<p>Aktualnie nie ma żadnych rezerwacji do zatwierdzenia.</p>`;
                } else if (reservationHTML != "")
                    contentHTML += reservationHTML;
                contentHTML += `</div>`;
            } else if (reservations === null) {
                contentHTML += `<p>Aktualnie nie ma żadnych rezerwacji do zatwierdzenia.</p>
                                </div>`;
            }
        }

        dynamicContent.innerHTML = contentHTML;

        if(sectionName === "admin") {
            document.querySelector('#addItem').addEventListener('click', () => {
                addItem(document.querySelector('#addItem').parentElement.parentElement);
            });
            let reservationButtons = document.querySelectorAll('.reservationButton');
            if(reservationButtons.length > 0) {
                reservationButtons.forEach((button) => {
                    button.addEventListener('click', () => {
                        aproveReservation(button);
                    });
                });
            };
        } else if (sectionName === "items") {
            document.querySelectorAll('.reservationButton').forEach((button) => {
                button.addEventListener('click', () => {
                    reserveItem(button);
                })
            });
        } else if (sectionName === "reservations") {
            document.querySelectorAll('.reservationButton').forEach((button) => {
                if(button.innerText === "Zwróć sprzęt") {
                    button.addEventListener('click', () => {
                        returnItem(button);
                    });
                } else if(button.innerText === "Anuluj rezerwację") {
                    button.addEventListener('click', () => {
                        cancelReservation(button);
                    });
                }
            });
        }
        document.getElementById("back").addEventListener("click", () => {
            contentSection.classList.add("hidden");
            dashboard.classList.remove("hidden");
        });
    }
});

function logout() {
    localStorage.removeItem("loggedInUser"); // usuwamy dane użytkownika
    window.location.href = "../index.html"; // wracamy do logowania
}