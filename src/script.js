document.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname === "/src/sign_up.html") {
        let signUpBlock = document.querySelector('.sign_up_block');
        let logInButton = document.querySelector('#logInButton').addEventListener("click", () => {
            waveAnimation(signUpBlock, "login");
        });
        let registerButton = document.querySelector('#registerButton').addEventListener("click", () => {
            waveAnimation(signUpBlock, "register");
        });
    } else if (window.location.pathname === "/src/dashboard.html") {
        
    } else if (window.location.pathname === "/src/items_list.html") {

    } else if (window.location.pathname === "/src/add_item.html") {

    } else if (window.location.pathname === "/index.html") {

    }
});

function waveAnimation(signUpBlock, loginOrRegister) {
    let children = Array.from(signUpBlock.children);
    let waveElement = document.createElement('div');
    waveElement.style.backgroundColor = "orange";
    waveElement.style.height = "10px";
    waveElement.style.width = "100%";
    signUpBlock.appendChild(waveElement);
    waveElement.style.transiton = ".25s ease-in-out";
    waveElement.style.animation = "1.5s waveAnimation"
    waveElement.style.height = 0;
    for(let i = 0; i < 2; i++) {
        children[i].remove();
    }

    setTimeout(() => {
        waveElement.remove();
        let containerDiv = document.createElement('div');
        containerDiv.style.width = "100%";
        containerDiv.style.height = "100%";
        signUpBlock.appendChild(containerDiv);
        let h3Element = document.createElement('h3');
        containerDiv.appendChild(h3Element);
        let emailInput = document.createElement("input");
        emailInput.setAttribute("type", "email");
        emailInput.setAttribute('placeholder', "Type your e-mail");
        emailInput.classList.add("formInput");
        containerDiv.appendChild(emailInput);
        let passwordInput = document.createElement("input");
        passwordInput.setAttribute("type", "password");
        passwordInput.setAttribute('placeholder', "Type your password");
        passwordInput.classList.add("formInput");
        containerDiv.appendChild(passwordInput);
        let finalButton = document.createElement('button');
        finalButton.classList.add('sign_up_button');
        let telephoneNumber = document.createElement("input");
        let country = document.createElement('input');
        let zipCode = document.createElement('input');

        if(loginOrRegister === "login") {
            h3Element.innerText = "Log in";
            let dontRemember = document.createElement('a');
            dontRemember.innerText = "Forgot your password?";
            containerDiv.appendChild(dontRemember);
            dontRemember.style.color = "#a2bffe";
            finalButton.innerText = "Log in";
        } else if (loginOrRegister === "register") {
            h3Element.innerText = "Register";
            finalButton.innerText = "Register";
            let childDiv = document.createElement('div');
            childDiv.classList.add('sign_up_block_child');
            let telephoneDiv = document.createElement('div');
            telephoneDiv.classList.add('formDiv');
            telephoneNumber.setAttribute('type', 'text');
            telephoneNumber.setAttribute("placeholder", "e.g.: 123-456-789");
            telephoneNumber.setAttribute("pattern", "[0-9]{3}-[0-9]{3}-[0-9]{3}");
            telephoneNumber.setAttribute('size', "30");
            telephoneNumber.classList.add('formInput');
            let telephoneText = document.createElement('span');
            telephoneText.innerText = "Telephone number";
            telephoneText.classList.add("signUpFormText");
            telephoneDiv.appendChild(telephoneText);
            telephoneDiv.appendChild(telephoneNumber);

            let countryDiv = document.createElement('div');
            let zipCodeDiv = document.createElement('div');
            countryDiv.classList.add('formDiv');
            zipCodeDiv.classList.add('formDiv');
            let countryText = document.createElement('span');
            countryText.innerText = "Country";
            countryText.classList.add("signUpFormText");
            country.setAttribute('type', 'text');
            country.setAttribute('placeholder', 'e.g. Poland');
            country.setAttribute('size', "30");
            country.classList.add('formInput');
            telephoneNumber.setAttribute('size', "30");
            telephoneNumber.classList.add('formInput');
            let zipCodeText = document.createElement('span');
            zipCodeText.innerText = "Zip code";
            zipCodeText.classList.add("signUpFormText");
            zipCode.setAttribute('type', 'text');
            zipCode.setAttribute('placeholder', 'e.g. 32-640');
            zipCode.setAttribute('size', "30");
            zipCode.classList.add('formInput');
            countryDiv.appendChild(countryText);
            countryDiv.appendChild(country);
            zipCodeDiv.appendChild(zipCodeText)
            zipCodeDiv.appendChild(zipCode)
            childDiv.appendChild(countryDiv);
            childDiv.appendChild(zipCodeDiv);
            childDiv.appendChild(telephoneDiv);
            containerDiv.appendChild(childDiv);
        }

        finalButton.addEventListener("click", () => {
            loginAndRegister(loginOrRegister, emailInput, passwordInput, telephoneNumber, country, zipCode);
        });
        document.addEventListener('keydown', (key) => {
            if(key.key == "Enter") {
                loginAndRegister(loginOrRegister, emailInput, passwordInput, telephoneNumber, country, zipCode);  
            }
        })
        containerDiv.appendChild(finalButton);
    }, 1500)
}

function loginAndRegister(loginOrRegister, emailInput, passwordInput, telephoneNumber, country, zipCode) {
    if (loginOrRegister === "login") {
        let accounts = localStorage.getItem("accounts");
        if (!accounts) {
            alert("No accounts found! Please register first.");
            return;
        }

        // konwertujemy string na tablicę
        accounts = JSON.parse(accounts); 

        let email = emailInput.value;
        let password = passwordInput.value;

        // console.log("Wszystkie konta:", accounts); // debug purposes - sprawdzamy co jest w localStorage
        // console.log("Szukam:", email, password);

        // szukamy użytkownika
        let foundUser = accounts.find(account => 
            account.email === email && account.password === password
        );

        if (foundUser) {
            // zapisujemy zalogowanego użytkownika
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser)); 
            alert("Logged in successfully!");
            // przekierowanie do panelu użytkownika
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password!");
        }
    } else if (loginOrRegister === "register") {// jeśli w localStorage jest coś, parsujemy do tablicy, w przeciwnym razie tworzymy pustą tablicę        
        let accounts = localStorage.getItem("accounts");
        accounts = accounts ? JSON.parse(accounts) : [];

        // sprawdzamy, czy e-mail już istnieje
        if (accounts.some(account => account.email === emailInput.value)) {
            alert("You already have an account! Please log in.");
            return;
        }
    
        // tworzymy nowego użytkownika jako OBIEKT
        let newUser = {
            email: emailInput.value,
            password: passwordInput.value,
            telephone: telephoneNumber.value,
            country: country.value,
            zipCode: zipCode.value
        };
    
        accounts.push(newUser);
        localStorage.setItem("accounts", JSON.stringify(accounts)); // Zapis poprawny!

        alert("Account created successfully! You can now log in.");
        location.reload();
    }
}

function addItem(parent) {
    let itemName = parent.querySelector('#itemName');
    let itemDescription = parent.querySelector('#itemDescription');
    let itemImgPath = parent.querySelector('#itemImgPath');

    if(itemName.value.trim() != null && itemDescription.value.trim() != null && itemImgPath.value.trim() != null) {
        let items = localStorage.getItem("items");
        items = items ? JSON.parse(items) : [];

        let newItem = {
            id: Math.floor(Math.random() * 10000) + 1,
            name: itemName.value.trim(),
            description: itemDescription.value.trim(),
            imgPath: itemImgPath.value.trim()
        };

        items.push(newItem);
        localStorage.setItem("items", JSON.stringify(items));

        alert("Item added successfully!");
    } else {
        alert("You have to fill every field!");
    }
}

function reserveItem(button) {
    let itemID = button.getAttribute("data-ID");
    let loggedInUser = localStorage.getItem("loggedInUser");
    loggedInUser = JSON.parse(loggedInUser);

    let reservations = localStorage.getItem("reservations");
    reservations = reservations ? JSON.parse(reservations) : [];

    let items = localStorage.getItem("items");
    items = JSON.parse(items);

    for(let item of items) {
        if(item.id == itemID) {
            let reservedItem = {
                id: item.id,
                name: item.name,
                description: item.description,
                imgPath: item.imgPath,
                reserved: true
            };
            items.splice(items.indexOf(item), 1, reservedItem);
            localStorage.setItem("items", JSON.stringify(items));
        }
    }

    let newReservation = {
        itemID: itemID,
        userEmail: loggedInUser["email"],
        pending: true
    };
    
    reservations.push(newReservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    alert("New reservation added successfully!");
    let divItemBlock = button.parentElement.parentElement;
    divItemBlock.remove();
}

function cancelReservation(button) {
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let items = JSON.parse(localStorage.getItem("items")) || [];

    // pobranie ID przedmiotu z klikniętego przycisku
    let itemId = button.getAttribute("data-id");

    // znalezienie indeksu rezerwacji użytkownika dla danego przedmiotu
    let reservationIndex = reservations.findIndex(reservation => 
        reservation.userEmail === loggedInUser.email && reservation.itemID == itemId
    );

    if (reservationIndex !== -1) {
        // pobranie rezerwacji przed jej usunięciem
        let reservation = reservations[reservationIndex];

        // usunięcie rezerwacji z tablicy
        reservations.splice(reservationIndex, 1);
        localStorage.setItem("reservations", JSON.stringify(reservations));

        // znalezienie przedmiotu w `items`
        let itemIndex = items.findIndex(item => item.id == itemId);
        if (itemIndex !== -1) {
            // tworzy nowy obiekt bez `pending`
            let reservedItem = {
                id: items[itemIndex].id,
                name: items[itemIndex].name,
                description: items[itemIndex].description,
                imgPath: items[itemIndex].imgPath
            };

            // zamienia stary obiekt na nowy (bez pending)
            items.splice(itemIndex, 1, reservedItem);
            localStorage.setItem("items", JSON.stringify(items));
        }

        // usunięcie elementu z interfejsu
        button.closest(".item_block").remove();
        alert("Reservation canceled successfully!");
    } else {
        alert("Erorr: Couldn't find this reservation!");
    }
}

function aproveReservation(button) {
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    let items = JSON.parse(localStorage.getItem("items")) || [];

    // pobranie ID przedmiotu z klikniętego przycisku
    let itemId = button.getAttribute("data-id");

    // znalezienie rezerwacji pasującej do przedmiotu
    let reservationIndex = reservations.findIndex(reservation => reservation.itemID == itemId && reservation.pending);

    if (reservationIndex !== -1) {
        let reservation = reservations[reservationIndex];

        // aktualizacja rezerwacji (zmiana `pending` na `false`)
        updateReservation(reservation, reservations, itemId);

        // znalezienie przedmiotu
        let itemIndex = items.findIndex(item => item.id == itemId);
        if (itemIndex !== -1) {
            let reservedItem = {
                id: items[itemIndex].id,
                name: items[itemIndex].name,
                description: items[itemIndex].description,
                imgPath: items[itemIndex].imgPath,
                reserved: true
            };

            // zamiana obiektu w `items`
            items.splice(itemIndex, 1, reservedItem);
            localStorage.setItem("items", JSON.stringify(items));
        }

        // usunięcie elementu z UI
        button.closest(".item_block").remove();
        alert("Reservation approved successfully!");
    } else {
        alert("Błąd: Nie znaleziono rezerwacji!");
    }
}

function updateReservation(reservation, reservations, itemId) {
    let newReservation = {
        itemID: itemId,
        userEmail: reservation.userEmail,
        pending: false,
        date: new Date().toLocaleDateString()
    };

    let reservationIndex = reservations.findIndex(res => res.itemID == itemId && res.pending);
    if (reservationIndex !== -1) {
        reservations.splice(reservationIndex, 1, newReservation);
        localStorage.setItem("reservations", JSON.stringify(reservations));
    }
}


function returnItem(button) {
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    let items = JSON.parse(localStorage.getItem("items")) || [];

    // pobranie ID przedmiotu z klikniętego przycisku
    let itemId = button.getAttribute("data-id");

    // znalezienie rezerwacji pasującej do przedmiotu
    let reservationIndex = reservations.findIndex(reservation => reservation.itemID == itemId && !reservation.pending);

    if (reservationIndex !== -1) {
        let reservation = reservations[reservationIndex];

        updateReturn(reservation, reservations, itemId);

        // znalezienie przedmiotu
        let itemIndex = items.findIndex(item => item.id == itemId);
        if (itemIndex !== -1) {
            let reservedItem = {
                id: items[itemIndex].id,
                name: items[itemIndex].name,
                description: items[itemIndex].description,
                imgPath: items[itemIndex].imgPath,
                reserved: false
            };

            // zamiana obiektu w `items`
            items.splice(itemIndex, 1, reservedItem);
            localStorage.setItem("items", JSON.stringify(items));
        }

        // usunięcie elementu z UI
        button.closest(".item_block").remove();
        alert("Item returned successfully!");
    } else {
        alert("Error: Couldn't find this reservation!");
    }
}

function updateReturn(reservation, reservations, itemId) {
    let newReservation = {
        itemID: itemId,
        userEmail: reservation.userEmail,
        date: new Date().toLocaleDateString()
    };

    let reservationIndex = reservations.findIndex(res => res.itemID == itemId && !res.pending);
    if (reservationIndex !== -1) {
        reservations.splice(reservationIndex, 1, newReservation);
        localStorage.setItem("reservations", JSON.stringify(reservations));
    }
}