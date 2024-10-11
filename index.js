//Bảng màu cho background tương ứng với từng type
const typeColor = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
    steel: "#33334b"
};



//tạo class giao tiếp với server, gửi request


const baseURL = "https://pokeapi.co/api/v2/pokemon";

//class giao tiếp với server. Và mình biết luôn, chỉ có xài api get
//cho nên viết ngắn gọn là được

class Http {
    get(url) {
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                };
            });
    };
};

//class Store chuyên giải quyết lấy dữ liệu về
class Store {
    //thay vì mỗi lần phải đúc ra object để gửi request
    //thì mình coi nó như một thuộc tính luôn để dễ sử dụng
    constructor() {
        this.http = new Http();
    };

    //viết hàm lấy dữ liệu về với mỗi lần lấy là random khác nhau
    getPokeData() {
        //Tạo ra một con id random từ 1 đến 250
        //lẫy một con số đại từ 0 đến 1 * 250 nhưng phải + 1 vì lỡ 0 * 250 = 0 thì k được
        //con số lấy đại đó được làm tròn xuống
        const id = Math.floor(Math.random() * 700) + 1;
        //nhờ thuộc tính có chứa instance của Http để giao tiếp
        //với server lấy promise<data> về cho từng id random
        return this.http.get(`${baseURL}/${id}`);
        //ai nhờ store lấy data thì store sẽ quăng ra cho cục promise<data/id>
        //rồi có cái promise đó rồi muốn làm gì thì làm

    };
};

class RenderUI {
    //chức năng đúc ra các object có chứa method hiện các thông tin lên ui
    genderCard(dataCard) {
        //lấy hp
        const hp = dataCard.stats[0].base_stat;
        //lấy src hình ảnh
        const imgSrc = dataCard.sprites.other.dream_world.front_default;
        //lấy tên pokemon
        const pokeName = dataCard.name[0].toUpperCase() + dataCard.name.slice(1,);
        //stats----------------------------------------
        //attack
        const statAttack = dataCard.stats[1].base_stat;
        //defense
        const statDefense = dataCard.stats[2].base_stat;
        //speed
        const statSpeed = dataCard.stats[5].base_stat;

        //nhét bỏ thông tin vào card
        let contentHtml = `
            <!-- máu -->
            <p class="hp">
                <span>HP</span>&#8194;${hp}
            </p>
            <!-- hình ảnh -->
            <img src=${imgSrc}
                alt="file error">
            <!-- tên -->
            <h2 class="poke-name">${pokeName}</h2>
            <!-- hệ -->
            <div class="types"></div>
            <!-- chi tiết -->
            <div class="stats">
                <div>
                    <h3>${statAttack}</h3>
                    <p>Attack</p>
                </div>
                <div>
                    <h3>${statDefense}</h3>
                    <p>Defense</p>
                </div>
                <div>
                    <h3>${statSpeed}</h3>
                    <p>Speed</p>
                </div>
            </div>`;
        //dom tới và nhét card vào
        //****Lưu ý phải có card rồi mới thay đổi types mới được nhé
        document.querySelector("#card").innerHTML = contentHtml;

        //---------------------------------------------------------------------------------------------------------------------
        //type từ đó tìm ra màu của background
        //typeColor ở trên là 1 object
        const themeColor = typeColor[dataCard.types[0].type.name];

        //**** .style là đi vào tới css và thay đổi màu cho background
        document.querySelector("#card").style.background = `radial-gradient(circle at 50% 0%, ${themeColor} 36%, #ffffff 36%)`

        // -------------------------------------------------------------------------------------------------------------------
        //****dom tới .types và nhét thông tin của hệ vào trước. Lý do mình k lấy như bthg ở trên
        //được vì đôi khi có con có tới 2 hệ
        const types = dataCard.types;
        types.forEach((item) => {
            //tạo ra span ảo
            let spanItem = document.createElement("span");
            //nhét từng tên thuộc tính vào span
            spanItem.textContent = item.type.name;
            //nhét span đó vào types
            document.querySelector(".types").appendChild(spanItem);
        });
        //thay đổi màu cho các ô hệ luôn
        //*****đầu tiên lấy mảng chứa các màu đã
        let colorTable = [];
        types.forEach((item) => {
            //nhét lần lượt các mã màu vào
            colorTable.push(typeColor[item.type.name]);
        });

        //****thêm màu cho các span
        //dom tới lấy tất cả span có trong class types rồi thêm màu vào cho nó
        let i = 0;
        document.querySelectorAll(".types span").forEach((item) => {
            //đi đến từng span và truy cập vào css của nó chỉnh màu cho background
            item.style.background = colorTable[i];
            ++i;
        });
    };

};

// bắt sự kiện click của button thì sẽ thay đổi thông tin của từng con pokemon
document.querySelector("#btn").addEventListener("click", (event) => {
    //tạo ra bản thể store
    const store = new Store();
    //tạo ra bản thể ui
    const ui = new RenderUI();
    //store sẽ đưa cho mình cục promise<data/id>. Mình cầm nó sau đó .then bắt cái data/id rồi làm tiếp
    store.getPokeData()
        .then((data) => {
            //mình sẽ lấy cục data đó và nhờ ui render ra dùm mình
            ui.genderCard(data);
        });
})

// bắt sự kiện load của trang thì sẽ thay đổi thông tin của từng con pokemon
window.addEventListener("DOMContentLoaded", (event) => {
    //tạo ra bản thể store
    const store = new Store();
    //tạo ra bản thể ui
    const ui = new RenderUI();
    //store sẽ đưa cho mình cục promise<data/id>. Mình cầm nó sau đó .then bắt cái data/id rồi làm tiếp
    store.getPokeData()
        .then((data) => {
            //mình sẽ lấy cục data đó và nhờ ui render ra dùm mình
            ui.genderCard(data);
        });
})

