// 오늘 날짜 구하기
let today = new Date(),
  year = today.getFullYear(),
  month = today.getMonth() + 1,
  date = today.getDate(),
  day = today.getDay(),
  hours = today.getHours(),
  minutes = today.getMinutes(),
  inhours = ((hours + 11) % 12) + 1,
  zeroMins = minutes < 10 ? "0" + minutes : minutes;
// ----------------------------------------------------------------------------------------

// 레이아웃
const layout = $(".layoutStyle");

// 전역변수사용
const eScope = this;

// ----------------------------------------------------------------------------------------

// 시작 데이터(로고)
var logoForm = {
  SP: [
    {
      logoImg: "/img/logo/spsymbol_logo_B.png",
      logoTitle: "SOUNDPANDA",
      logoDesc: "어서오세요. 사운드판다입니다. :)",
    },
  ],
  PS: [
    {
      logoImg: "/img/logo/pandasia_logo.png",
      logoTitle: "PANDASIA",
      logoDesc: "어서오세요. 판다지아입니다. :)",
    },
  ],
};
// ----------------------------------------------------------------------------------------

/**
 * 공통 함수
 */
// 요일 구하기
function getWeeks() {
  let week = ["일", "월", "화", "수", "목", "금", "토"],
    dayOfWeek = week[day] + "요일";

  return dayOfWeek;
}

// 답변 시간
function filedMessage() {
  let cautionText = $(".cauText");

  if (hours > 11 && hours < 13) {
    cautionText.append(`<p>지금은 점심시간입니다.</p>`);
  } else if (hours >= 17) {
    cautionText.append("<p>내일 다시 만나요 :)</p>");
  } else if (hours > 0 && hours < 9) {
    cautionText.append(`<p>${getWeeks()} am 09:00 - pm 17: 00</p>`);
  } else {
    cautionText.append("<p>답변이 지연될 수 있습니다.</p>");
  }

  if (getWeeks() == "토요일" && getWeeks() == "일요일") {
    cautionText.append("<p>주말은 쉬어요 :)</p>");
  }
}

// 채팅 시작 시간
function startTime() {
  let timerTxt = $(".timerTxt");

  if (hours > 12) {
    timerTxt.text(`오후 ${inhours}:${zeroMins}`);
  } else {
    timerTxt.text(`오전 ${inhours}:${zeroMins}`);
  }
}

// hover시 전화번호
function telIcon() {
  let tel = $('a[href="tel:02-1666-0575"]');

  tel.mouseenter(function () {
    $(this).addClass("callNum");
  });

  tel.mouseleave(function () {
    $(this).removeClass("callNum");
  });
}

// 뒤로 가기
function backHome() {
  let backBtn = $(".backBtnWrap");

  backBtn.click(function () {
    document.querySelector(".bot").remove();
    setHome();
  });
}

// 홈으로 돌아가기
function reHome() {
  let reBtn = $(".reHome");

  reBtn.click(function () {
    document.querySelector(".bot").remove();
    setHome();
  });
}

// 챗 닫기
function closeChat() {
  let closeBtn = $(".closeXBtn");

  closeBtn.click(function () {
    let botMassenger = $(parent.document).find("#botWrapper"),
      botFrame = botMassenger.find("#botFrame");

    botMassenger.toggleClass("on");
    botFrame.remove();
  });
}

// 챗 시작
function startChat() {
  let chatStartBtn = $(".chatBtn");

  chatStartBtn.click(function () {
    // 유니크코드 생성(uniqeCode_api) - 이전 상담목록 생성하기 위함
    saveUniqeCode();

    // 채팅 화면 만들기
    chatWindow();
  });
}

// 챗 시작(상담목록)
function startReTurn() {
  let reTurnBtn = $(".addChat");

  reTurnBtn.click(function () {
    // 상담 목록 채팅화면 만들기
    reTurnChat();
  });
}

// 송장번호 조회하기
function copyShipNum() {
  var invoiceNum = document.getElementById("invoiceNum").value;

  window.open(
    `https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=CJ%EB%8C%80%ED%95%9C%ED%86%B5%EC%9A%B4+${invoiceNum}`,
    "_blank"
  );
}

// 유니크코드 생성(uniqeCode_api)
function saveUniqeCode() {
  let uniqeCode_api = `https://lifezip.co.kr:8443/soundpanda/API?type=UcodeGen`;

  $.get(uniqeCode_api, function (json) {
    let uniqeCodeJson = json.key;
    localStorage.setItem("uniqeCode", uniqeCodeJson);

    // 유니크코드 로드
    LoadUniqeCode();
  });
}

// 유니크코드 로드
function LoadUniqeCode() {
  let uniqeCode = localStorage.getItem("uniqeCode");
  this.uniqeCode = uniqeCode;
}

// 홈 화면 카드(상담목록)(record_api)
function plusCard() {
  let addCard = document.createElement("div");
  addCard.setAttribute("class", "addCard");

  this.addCard = addCard;

  // 유니크코드 로드
  LoadUniqeCode();

  let uniqeCode = eScope.uniqeCode,
    record_api = `https://lifezip.co.kr:8443/soundpanda/API?type=GetRecord&ucode=${uniqeCode}`;

  $.get(record_api, function (json) {
    let firstRecord = json;
    let Err = firstRecord.Err;

    // 상담 목록이 없으면
    if (Err == 1) {
      addCard.remove();
    } else {
      for (i = 0; i < firstRecord.length; i++) {
        let fRecordFormArr = JSON.parse(firstRecord[i].form);
        for (j = 0; j < fRecordFormArr.length; j++) {
          let addHd = document.createElement("div");
          addHd.setAttribute("class", "addHd");
          addHd.innerHTML = `
            <div class="add_title">
              <p class="add_titleWrapper">이전 상담목록</p>
            </div>
          `;

          let addChatContents = document.createElement("div");
          addChatContents.setAttribute("class", "addChat textbox");
          addChatContents.innerHTML = `
            <div class="addChatImg">
              <div class="emo"></div>
            </div>
            <div class="addChatContents">
              <div class="hdText">
                <div class="name">판다봇</div>
                <div class="date">${month}/${date}</div>
              </div>
              <div class="bdText">${fRecordFormArr[0].msText[0]}</div>
            </div>
            <div class="addChatMore">
              <div class="moreR"></div>
              <div class="moreAction">
                <div class="moreIcon"></div>
              </div>
            </div>
          `;
          addCard.append(addHd, addChatContents);
          break;
        }
        break;
      }
    }

    // 챗 시작(상담목록)
    startReTurn();
  });
}

// 홈 화면 카드1(공지사항)(init_api)
function createCard1() {
  let cardOne = document.createElement("div");
  cardOne.setAttribute("class", "card1 cardS");
  this.cardOne = cardOne;

  // 디폴트api
  let init_api = "https://lifezip.co.kr:8443/soundpanda/API?tcode=0000";
  $.get(init_api, function (json) {
    let initForm = JSON.parse(json.form);

    cardOne.innerHTML = `
      <div class="headBorder">
        <p>신규 상담</p>
      </div>
      <div class="welcome textbox">
        <div class="welImg">
          <div class="emo"></div>
        </div>
        <div class="welcomeContents">
          <div class="hdText">판다봇</div>
          <div class="bdText">${initForm[0].msText[0]}</div>
        </div>
      </div>
      <div class="newChat">
        <div class="chatBtn actBtn" data-tcode="0001">
          바로 문의하기
          <div class="chatSend"></div>
        </div>
      </div>
      <div class="caution">
        <div class="cauText">
          <div class="cauIcon" name="delayed"></div>
        </div>
      </div>
    `;

    // 상담 시간 표시
    if ($(".caution").find("cauText")) {
      filedMessage();
    }

    // 채팅시작하기
    startChat();
  });
}

// 홈 화면 카드2(다른 방법 상담)
function createCard2() {
  let cardTwo = document.createElement("div");
  cardTwo.setAttribute("class", "card2 cardS");

  this.cardTwo = cardTwo;

  cardTwo.innerHTML = `
    <div class="bdText">다른 방법으로 상담</div>
    <div class="iconWrap">
      <a href="#none" class="iconBox" target="_blank">
        <div class="kakaoIcon icon"></div>
      </a>
      <a href="#none" class="iconBox" target="_blank">
        <div class="naverIcon icon"></div>
      </a>
      <a href="#none" class="iconBox" target="_blank">
        <div class="telIcon icon"></div>
      </a>
    </div>
  `;
}

// 홈 화면 카드3(인스타그램)
/*function createCard3() {
  let cardThree = document.createElement('div')
  cardThree.setAttribute('class', 'card3')

  this.cardThree = cardThree

  cardThree.innerHTML = `
  <div class="instaWrapper">
    <div class="instaBig">
      <div id="instaBanner"></div>
      <div class="instaHd">
        <div class="instaAction">
          <div class="instaIcon"></div>
          <div class="instaText">
            <a class="instaLink" href="https://www.instagram.com/soundpanda_official/"
              target="_blank">공식 인스타그램</a>
          </div>
        </div>
      </div>
      <div class="instaFt">
        <div class="instaPosts">
          <div class="postIcon"></div>
          <div class="smallText">내용 더보기</div>
        </div>
      </div>
    </div>
    <div id="instaFeed" class="instaTiny"></div>
  </div>
  `
  // 인스타 오픈
  instaOpen()
}*/

// 인스타그램 오픈
/*function instaOpen() {
    
  // 인스타그램 자체 API
  let api_endpoint = "https://lifezip.co.kr:8443/soundpanda/API?type=Instargrm";

  $.get(api_endpoint, function (json) {
    let instaBig = $('#instaBanner'),
      instaTiny = $('#instaFeed'),
      bigHtml = "",
      tinyHtml = "",
      bigLimit = 1,
      tinyLimit = 5,
      myfeed = json.data;

    // 큰썸네일 생성
    for (let i = 0; i < bigLimit; i++) {
      bigHtml += `<div class="bannerWrap">`

      if (myfeed[i].media_type !== "VIDEO") {
        bigHtml += `
        <div class="slideWrap">
          <img class="postImg" src="${myfeed[i].media_url}" alt="${myfeed[i].username}">
        </div>
        <div class="postWrap">
          <div class="contentBoxWrapper">
            <div class="textwrap">
              <div class="visibleText">${myfeed[i].caption}</div>
              <a class="instaLink" target="_blank" href="${myfeed[i].permalink}">더보기</a>
            </div>
          </div>
        </div>`
      } else if (myfeed[i].media_type == "VIDEO") {
        bigHtml += `<div class="slideWrap">
        <img class="postImg" src="${myfeed[i].thumbnail_url}" alt="${myfeed[i].username}">
      </div>
      <div class="postWrap">
        <div class="contentBoxWrapper">
          <div class="textwrap">
            <div class="visibleText">${myfeed[i].caption}</div>
            <a class="instaLink" target="_blank" href="${myfeed[i].permalink}">더보기</a>
          </div>
        </div>
      </div>`
      }
      bigHtml += `</div>`
    }
    instaBig.html(bigHtml)

    // 작은 썸네일 피드 생성
    for (let i = 0; i < tinyLimit; i++) {
      if (myfeed[i].media_type !== "VIDEO") {
        tinyHtml += `<div class="tinyBox"><img class="postImg" src="${myfeed[i].media_url}" alt="${myfeed[i].username}"></div>`
      } else if (myfeed[i].media_type == "VIDEO") {
        tinyHtml += `<div class="tinyBox"><img class="postImg" src="${myfeed[i].thumbnail_url}" alt="${myfeed[i].username}"></div>`
      }
    }
    instaTiny.html(tinyHtml)

    // 작은 썸네일 피드 클릭시 변경
    let instaBtn = $('.tinyBox')

    instaBtn.each(function (i) {
      $(this).click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active')

        if ($(this).hasClass('active')) {
          instaBig.html("");

          let changebigHtml = "";

          changebigHtml += `<div class="bannerWrap">`

          if (myfeed[i].media_type !== "VIDEO") {
            changebigHtml += `
            <div class="slideWrap">
              <img class="postImg" src="${myfeed[i].media_url}" alt="${myfeed[i].username}">
            </div>
            <div class="postWrap">
              <div class="contentBoxWrapper">
                <div class="textwrap">
                  <div class="visibleText">${myfeed[i].caption}</div>
                  <a class="instaLink" target="_blank" href="${myfeed[i].permalink}">더보기</a>
                </div>
              </div>
            </div>`
          } else if (myfeed[i].media_type == "VIDEO") {
            changebigHtml += `<div class="slideWrap">
            <img class="postImg" src="${myfeed[i].thumbnail_url}" alt="${myfeed[i].username}">
          </div>
          <div class="postWrap">
            <div class="contentBoxWrapper">
              <div class="textwrap">
                <div class="visibleText">${myfeed[i].caption}</div>
                <a class="instaLink" target="_blank" href="${myfeed[i].permalink}">더보기</a>
              </div>
            </div>
          </div>`
          }
          changebigHtml += `</div>`
          instaBig.html(changebigHtml)
          hoverText()
        }
      })
    })

    // 마우스오버
    function hoverText() {
      let moreTextBox = $('.postWrap'),
        moreTextBtnWrap = $('.instaPosts');

      moreTextBtnWrap.mouseenter(function () {
        moreTextBox.css('visibility', 'visible')
      })
      moreTextBox.parent().mouseleave(function () {
        moreTextBox.css('visibility', 'hidden')
      })
    }
    hoverText()

  })
}*/

// 이미지 슬라이더 (스와이퍼)
function slideStart() {
  let swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loop: false,
  });
}

// 기본 폼 양식(탬플릿) 생성하기
function createForm(temp) {
  // 전체 메세지(톡버블) 폼(디폴트)
  let massageWrap = document.createElement("div");
  massageWrap.setAttribute("class", "massageWrap");

  this.massageWrap = massageWrap;

  if (temp.formType == "textForm") {
    // 메시지폼 생성
    formMs(temp);
  } else if (temp.formType == "cardForm") {
    // 카드폼 생성
    formCard(temp);
  } else if (temp.formType == "commerceForm") {
    // 커머스폼 생성
    formCms(temp);
  } else if (temp.formType == "btnForm") {
    // 버튼폼 생성
    // formMs()
  }
  massageWrap.append(eScope.emoWrap, eScope.textWrap);
}

// 메세지폼 생성(디폴트)
function formMs(temp) {
  // 이모지 생성
  let emoWrap = document.createElement("div");
  emoWrap.setAttribute("class", "emoWrap");
  emoWrap.innerHTML = `
    <div class="emoBox">
      <div class="emo"></div>
    </div>
  `;
  this.emoWrap = emoWrap;

  // 텍스트랩 생성
  let textWrap = document.createElement("div");
  textWrap.setAttribute("class", "textWrap");
  this.textWrap = textWrap;
  // 텍스트 헤더 생성
  let txtHdBox = document.createElement("div");
  txtHdBox.setAttribute("class", "txtHdBox");
  txtHdBox.innerHTML = `<div class="teamName">판다봇</div>`;
  // 텍스트 버블 생성
  let txtMsBox = document.createElement("div");
  txtMsBox.setAttribute("class", "txtMsBox");
  // 텍스트 보더 생성
  let txtBorder = document.createElement("div");
  txtBorder.setAttribute("class", "txtBorder");

  let textForm = JSON.parse(temp.form);

  for (let i = 0; i < textForm.length; i++) {
    for (let j = 0; j < textForm[i].msText.length; j++) {
      if (textForm[i].msText[j] == null) {
        let msWrap = document.createElement("div"),
          msBox = document.createElement("div"),
          msDiv = document.createElement("div"),
          msTxt = document.createElement("div");

        msWrap.setAttribute("class", "msWrap");
        msBox.setAttribute("class", "msBox");
        msTxt.setAttribute("class", "msTxt");
        msTxt.innerHTML = "죄송합니다. 아직 준비중입니다. :( ";

        msDiv.append(msTxt);
        msBox.append(msDiv);
        msWrap.append(msBox);
        txtMsBox.append(msWrap);

        break;
      } else {
        let msWrap = document.createElement("div"),
          msBox = document.createElement("div"),
          msDiv = document.createElement("div"),
          msTxt = document.createElement("div");

        msWrap.setAttribute("class", "msWrap");
        msBox.setAttribute("class", "msBox");
        msTxt.setAttribute("class", "msTxt");
        msTxt.innerHTML = `${textForm[i].msText[j]}`;

        msDiv.append(msTxt);
        msBox.append(msDiv);
        msWrap.append(msBox);
        txtMsBox.append(msWrap);
      }
    }
    textWrap.append(txtHdBox, txtMsBox, txtBorder);
  }
}

// 카드폼 생성(디폴트)
function formCard(temp) {
  // 이모지 생성
  let emoWrap = document.createElement("div");
  emoWrap.setAttribute("class", "emoWrap");
  emoWrap.innerHTML = `
    <div class="emoBox">
      <div class="emo"></div>
    </div>
  `;
  this.emoWrap = emoWrap;

  // 텍스트랩 생성
  let textWrap = document.createElement("div");
  textWrap.setAttribute("class", "textWrap");
  this.textWrap = textWrap;

  // 텍스트 헤더 생성
  let txtHdBox = document.createElement("div");
  txtHdBox.setAttribute("class", "txtHdBox");
  txtHdBox.innerHTML = `<div class="teamName">판다봇</div>`;
  // 슬라이더 컨테이너 생성
  let txtBdWrap = document.createElement("div");
  txtBdWrap.setAttribute("class", "swiper");
  this.txtBdWrap = txtBdWrap;

  // 텍스트 버블 생성
  let txtCdBox = document.createElement("div");
  txtCdBox.setAttribute("class", "txtCdBox swiper-wrapper");
  // 텍스트 보더 생성
  let txtBorder = document.createElement("div");
  txtBorder.setAttribute("class", "txtBorder");

  let cardForm = JSON.parse(temp.form);

  for (let i = 0; i < cardForm.length; i++) {
    if (
      cardForm[i].cdImg == null &&
      cardForm[i].cdTitle == null &&
      cardForm[i].cdDesc == null &&
      cardForm[i].cdLink == null
    ) {
      // 텍스트 버블 컨테이너 생성
      txtBdWrap.setAttribute("class", "txtMsBox");
      txtCdBox.setAttribute("class", "txtCdBox");

      let cdWrap = document.createElement("div"),
        cdBox = document.createElement("div");

      cdWrap.setAttribute("class", "cdWrap");
      cdBox.innerHTML = "죄송합니다. 아직 준비 중 입니다 :( ";

      cdWrap.append(cdBox);
      txtCdBox.append(cdWrap);
      txtBdWrap.append(txtCdBox);

      break;
    } else {
      let cdWrap = document.createElement("div"),
        cdBox = document.createElement("div"),
        cdDiv = document.createElement("div"),
        cdImg = document.createElement("div"),
        cdTitle = document.createElement("strong"),
        cdDesc = document.createElement("p"),
        cdLink = document.createElement("a");

      cdWrap.setAttribute("class", "cdWrap swiper-slide");
      cdBox.setAttribute("class", "cdBox slideImg");
      cdImg.setAttribute("class", "cdImg");
      cdImg.style.backgroundImage = `url(${cardForm[i].cdImg})`;
      cdTitle.setAttribute("class", "cdTitle");
      cdTitle.innerText = `${cardForm[i].cdTitle}`;
      cdDesc.setAttribute("class", "cdDesc");
      cdDesc.innerText = `${cardForm[i].cdDesc}`;
      cdLink.setAttribute("class", "cdLink");
      cdLink.setAttribute("href", `${cardForm[i].cdLink}`);
      cdLink.setAttribute("target", "_parent");

      cdDiv.append(cdImg, cdTitle, cdDesc, cdLink);
      cdBox.append(cdDiv);
      cdWrap.append(cdBox);
      txtCdBox.append(cdWrap);
      txtBdWrap.append(txtCdBox);
    }
  }
  textWrap.append(txtHdBox, txtBdWrap, txtBorder);
}

// 커머스폼 생성(디폴트)
function formCms(temp) {
  // 이모지 생성
  let emoWrap = document.createElement("div");
  emoWrap.setAttribute("class", "emoWrap");
  emoWrap.innerHTML = `
    <div class="emoBox">
      <div class="emo"></div>
    </div>
  `;
  this.emoWrap = emoWrap;

  // 텍스트랩 생성
  let textWrap = document.createElement("div");
  textWrap.setAttribute("class", "textWrap");
  this.textWrap = textWrap;

  // 텍스트 헤더 생성
  let txtHdBox = document.createElement("div");
  txtHdBox.setAttribute("class", "txtHdBox");
  txtHdBox.innerHTML = `<div class="teamName">판다봇</div>`;
  // 슬라이더 컨테이너 생성
  let txtBdWrap = document.createElement("div");
  txtBdWrap.setAttribute("class", "swiper");
  // 텍스트 버블 생성
  let txtPrdBox = document.createElement("div");
  txtPrdBox.setAttribute("class", "txtPrdBox swiper-wrapper");
  // 텍스트 보더 생성
  let txtBorder = document.createElement("div");
  txtBorder.setAttribute("class", "txtBorder");

  let commerceForm = JSON.parse(temp.form);

  for (let i = 0; i < commerceForm.length; i++) {
    if (
      commerceForm[i].prdImg == null &&
      commerceForm[i].prdName == null &&
      commerceForm[i].salePrice == null &&
      commerceForm[i].prdPrice == null &&
      commerceForm[i].prdLink == null
    ) {
      txtBdWrap.setAttribute("class", "txtMsBox");
      txtPrdBox.setAttribute("class", "txtPrdBox");

      let prdWrap = document.createElement("div"),
        prdBox = document.createElement("div");

      prdWrap.setAttribute("class", "prdWrap");
      prdBox.innerHTML = "죄송합니다. 아직 준비 중 입니다 :( ";

      prdWrap.append(prdBox);
      txtPrdBox.append(prdWrap);
      txtBdWrap.append(txtPrdBox);

      break;
    } else {
      let prdWrap = document.createElement("div"),
        prdBox = document.createElement("div"),
        prdDiv = document.createElement("div"),
        prdImg = document.createElement("div"),
        prdName = document.createElement("strong"),
        prdPriceBox = document.createElement("div");
      (prdPrice = document.createElement("p")),
        (salePrice = document.createElement("p")),
        (disRate = document.createElement("p")),
        (prdLink = document.createElement("a"));

      prdWrap.setAttribute("class", "prdWrap swiper-slide");
      prdBox.setAttribute("class", "prdBox slideImg");
      prdImg.setAttribute("class", "prdImg");
      prdImg.style.backgroundImage = `url(${commerceForm[i].prdImg})`;
      prdName.setAttribute("class", "prdName");
      prdName.innerText = `${commerceForm[i].prdName}`;

      // 할인율 구하기
      let sprice = `${commerceForm[i].salePrice}`,
        dprice = `${commerceForm[i].prdPrice}`,
        spriceN = parseInt(sprice.replace(/,/g, "")),
        dpriceN = parseInt(dprice.replace(/,/g, ""));

      const RATE = Math.round(100 - (`${spriceN}` * 100) / `${dpriceN}`);

      prdPriceBox.setAttribute("class", "prdPriceBox");
      salePrice.setAttribute("class", "salePrice");
      salePrice.setAttribute("value", `${sprice}`);
      salePrice.innerText = `${sprice}`;
      prdPrice.setAttribute("class", "prdPrice");
      prdPrice.setAttribute("value", `${dprice}`);
      prdPrice.innerText = `${dprice}`;
      disRate.setAttribute("class", "disRate");
      disRate.innerText = `${RATE}%`;

      prdLink.setAttribute("class", "prdLink");
      prdLink.setAttribute("href", `${commerceForm[i].prdLink}`);
      prdLink.setAttribute("target", "_parent");

      prdPriceBox.append(salePrice, prdPrice, disRate);
      prdDiv.append(prdImg, prdName, prdPriceBox, prdLink);
      prdBox.append(prdDiv);
      prdWrap.append(prdBox);
      txtPrdBox.append(prdWrap);
      txtBdWrap.append(txtPrdBox);
    }
  }

  textWrap.append(txtHdBox, txtBdWrap, txtBorder);
}

// 버튼 생성
function createBtn(temp) {
  let btnWrap = document.createElement("div");
  btnWrap.setAttribute("class", "btnWrap");
  this.btnWrap = btnWrap;

  // 버튼 생성(디폴트)
  let btnBox = document.createElement("div");
  btnBox.setAttribute("class", "btnBox");

  let defaultBtn = JSON.parse(temp.defaultBtn);

  if (defaultBtn == null) {
    // 디폴트 버튼 설정을 안했을 경우
  } else {
    for (let i = 0; i < defaultBtn.length; i++) {
      if (defaultBtn[i].dBtnCode !== null) {
        let setBtn = document.createElement("button");
        setBtn.setAttribute("class", "actBtn");
        setBtn.setAttribute("data-tcode", `${defaultBtn[i].dBtnCode}`);

        setBtn.innerText = `${defaultBtn[i].dBtnName}`;

        btnBox.append(setBtn);
      } else if (
        defaultBtn[i].dBtnName == "처음으로" &&
        defaultBtn[i].dBtnCode == null &&
        defaultBtn[i].dBtnLink == null
      ) {
        let setBtn = document.createElement("button");
        setBtn.setAttribute("class", "reHome");

        setBtn.innerText = `${defaultBtn[i].dBtnName}`;

        btnBox.append(setBtn);
      } else if (
        defaultBtn[i].dBtnCode == null ||
        defaultBtn[i].dBtnLink !== null
      ) {
        let setBtn = document.createElement("button");
        setBtn.setAttribute("class", "linkBtn");

        let setBtnS = document.createElement("span");
        setBtnS.innerHTML = `${defaultBtn[i].dBtnName}`;
        let setBtnA = document.createElement("a");
        setBtnA.setAttribute("href", `${defaultBtn[i].dBtnLink}`);
        setBtnA.setAttribute("class", "otherLink");
        setBtnA.setAttribute("target", "_blank");

        setBtn.append(setBtnS, setBtnA);

        btnBox.append(setBtn);
      }
    }
    btnWrap.append(btnBox);
  }
}

// 상담목록 채팅 화면 버튼 생성
function returnChatBtn(uniqeTemp) {
  let btnWrap = document.createElement("div");
  btnWrap.setAttribute("class", "btnWrap");
  this.btnWrap = btnWrap;

  // 버튼 생성(디폴트)
  let btnBox = document.createElement("div");
  btnBox.setAttribute("class", "btnBox");

  let tName = uniqeTemp;

  let setBtn = document.createElement("button");
  setBtn.setAttribute("class", "nonBtn active");

  setBtn.innerText = `${tName}`;

  btnBox.append(setBtn);

  btnWrap.append(btnBox);
}

// input 생성
function createInput() {
  let inputMs = document.createElement("div");
  inputMs.setAttribute("class", "inputMs");

  this.inputMs = inputMs;

  let careBox = document.createElement("form");
  careBox.setAttribute("class", "careBox");
  careBox.setAttribute("name", "care");
  careBox.setAttribute("id", "careForm");

  let fieldset = document.createElement("fieldset");

  let nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "userId");
  nameInput.setAttribute("id", "userId");
  nameInput.setAttribute("placeholder", "구매자명을 입력해주세요.");

  let NumInput = document.createElement("input");
  NumInput.setAttribute("type", "text");
  NumInput.setAttribute("name", "phoneNum");
  NumInput.setAttribute("id", "phoneNum");
  NumInput.setAttribute("placeholder", "핸드폰 번호를 입력해주세요.");

  let select = document.createElement("select");
  select.setAttribute("name", "selectModel");
  select.setAttribute("id", "selectModel");

  let submitBtn = document.createElement("button");
  submitBtn.setAttribute("id", "submit");
  submitBtn.setAttribute("type", "button");
  submitBtn.innerText = "보내기";

  let callCenter = document.createElement("a");
  callCenter.setAttribute("id", "call");
  callCenter.setAttribute("href", "tel:02-1666-0575");
  callCenter.setAttribute("target", "_blank");
  callCenter.innerText = "고객센터";

  // 모델명 API
  modelName = `https://lifezip.co.kr:8443/soundpanda/API?tcode=model`;

  $.get(modelName, function (json) {
    let moName = json;
    moName.reverse();

    let firstOption = document.createElement("option");
    firstOption.setAttribute("value", "");
    firstOption.innerText = "모델명을 선택해주세요.";

    select.append(firstOption);

    for (i = 0; i < moName.length; i++) {
      let selectOption = document.createElement("option");
      selectOption.setAttribute("value", `${moName[i]}`);
      selectOption.innerText = `${moName[i]}`;

      firstOption.after(selectOption);
    }
  });

  fieldset.append(nameInput, NumInput, select, submitBtn, callCenter);
  careBox.append(fieldset);
  inputMs.append(careBox);
}

// input (이름칸, 번호칸 정규표현식 일치)
function wordMatch() {
  $("#userId").blur(function () {
    let reqWord = /^[가-힣a-zA-Z]+$/;
    let nameVal = $(this).val();
    if (nameVal.length > 0) {
      if (!nameVal.match(reqWord)) {
        alert("이름은 한글, 영문으로 입력해주시기 바랍니다.");
        $("#userId").val("");
        $("#userId").focus();
        return;
      }
    }
  });

  $("#phoneNum").blur(function () {
    let reqNum = /^[0-9]*$/;
    let numVal = $(this).val();
    if (numVal.length > 0) {
      if (!numVal.match(reqNum)) {
        alert("전화번호는 숫자만 입력해주시기 바랍니다.");
        $("#phoneNum").val("");
        $("#phoneNum").focus();
        return;
      }
    }
  });
}

// file리스트 생성
function createFile() {
  let fileList = document.createElement("div");
  fileList.setAttribute("class", "fileList");

  this.fileList = fileList;
}

// 경계선 생성
function createBorder() {
  let msBorder = document.createElement("div");
  msBorder.setAttribute("class", "msBorder");

  this.msBorder = msBorder;

  let InnerLength = $(".scInner > div").length,
    curInHeight = $(".scChild").height();

  if (InnerLength > 5) {
    scrollBottom();
    // 해당 답변으로 스크롤
    function scrollBottom() {
      $(".scWrap").animate(
        {
          scrollTop: curInHeight,
        },
        400
      );
      return false;
    }
  }
}

// A/S접수데이터 전송 버튼 클릭
function startData() {
  let testBtn = $("#submit");

  testBtn.click(function () {
    // A/S접수데이터 전송
    submitData();
  });
}

// A/S접수데이터 전송
function submitData() {
  let userId = document.getElementById("userId"),
    phoneNum = document.getElementById("phoneNum"),
    modelOption = document.getElementById("selectModel"),
    selectOption = modelOption.options[modelOption.selectedIndex].value,
    uniCode = eScope.uniqeCode;

  // 이름, 번호를 입력하지 않았다면
  if (userId.value == "") {
    alert("ID를 입력해주세요");
    userId.focus();
    return;
  }

  if (phoneNum.value == "") {
    alert("핸드폰 번호를 입력해주세요.");
    phoneNum.focus();
    return;
  }

  if (selectOption == "") {
    alert("모델명을 선택해주세요.");
    modelOption.focus();
    return;
  }

  // ajax를 통한 서버로 data 전송
  $.ajax({
    type: "POST",
    url: "https://lifezip.co.kr:8443/soundpanda/API",
    data: {
      ID: userId.value,
      phoneNum: phoneNum.value,
      model: selectOption,
      uniqecode: uniCode,
    },
    dataType: "json",
    error: function (xhr, status, errorThrown) {
      // 요청이 실패하면 오류와 상태에 관한 정보가 fail()메소드로 전달됨.
      alert("죄송합니다. 다시 한 번 확인해주세요. :(");
      console.log(xhr, status, errorThrown);
    },
    success: function (json) {
      // 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨
      let filedInput = $(".inputMs"),
        massage15 = filedInput.prev(),
        msBorder15 = filedInput.next();
      msBorder15.remove();
      massage15.remove();
      filedInput.remove();

      (userId.value = ""), (phoneNum.value = ""), (selectOption.value = "");

      // AS접수결과확인
      checkAsCode(json);
    },
  });
}

// AS접수결과확인
function checkAsCode(ASCODE) {
  let uniCode = eScope.uniqeCode,
    checkCode = ASCODE.tCode;

  code_api = `https://lifezip.co.kr:8443/soundpanda/API?tcode=${checkCode}&ucode=${uniCode}`;

  let borderInner = document.querySelector(".scInner"),
    mborderLast = borderInner.lastChild;

  this.mborderLast = mborderLast;

  if (checkCode == "0017") {
    checkCode = "0017";
    code_api = `https://lifezip.co.kr:8443/soundpanda/API?tcode=${checkCode}&ucode=${uniCode}`;

    // 기본 폼 양식 생성
    createForm(ASCODE);

    // 버튼 생성
    createBtn(ASCODE);

    // 경계선 생성
    createBorder();

    mborderLast.after(massageWrap, btnWrap, msBorder);
  } else {
    // 기본 폼 양식 생성
    createForm(ASCODE);

    // // 버튼 생성
    createBtn(ASCODE);

    // 경계선 생성
    createBorder();

    mborderLast.after(massageWrap, btnWrap, msBorder);

    // A/S접수데이터 전송
    startData();
  }

  // 다음
  next();
}

// 다음 단계 이동
function next() {
  let actBtn = document.querySelectorAll(".actBtn");

  for (let i = 0; i < actBtn.length; i++) {
    actBtn[i].addEventListener("click", clickBtn, {
      once: true,
    });
  }

  // 유니크코드 로드
  LoadUniqeCode();

  // 슬라이더 실행
  slideStart();

  function clickBtn(el) {
    el.preventDefault();
    let cTarget = el.currentTarget;
    cTarget.classList.add("active");

    $(this).siblings().remove();
    $(this).css("pointer-events", "none");

    (eScope.code = cTarget.dataset.tcode),
      (code_api = `https://lifezip.co.kr:8443/soundpanda/API?tcode=${eScope.code}&ucode=${eScope.uniqeCode}`);

    targetText = cTarget.innerText;

    $.get(code_api, function (json) {
      let temp2nd = json;
      this.temp2nd = temp2nd;

      let borderInner = document.querySelector(".scInner"),
        mborderLast = borderInner.lastChild;

      this.mborderLast = mborderLast;

      // A/S접수결과확인(0015) 코드
      if (eScope.code === "0015") {
        // 기본 폼 양식 생성
        createForm(temp2nd);

        // input 생성
        createInput(temp2nd);

        // 경계선 생성
        createBorder();

        mborderLast.after(massageWrap, inputMs, msBorder);

        // input (이름칸, 번호칸 정규표현식 일치)
        wordMatch();

        // A/S접수데이터 전송
        startData();
      } else {
        // 기본 폼 양식 생성
        createForm(temp2nd);

        // 버튼 생성
        createBtn(temp2nd);

        // 경계선 생성
        createBorder();

        mborderLast.after(massageWrap, btnWrap, msBorder);

        // 다음 단계 이동
        next();

        // 홈으로 돌아가기
        reHome();
      }
    });

    el.stopPropagation();
    // 클릭 버블링 막기
    removeClick();
  }

  // 클릭 버블링 막기
  function removeClick() {
    return false;
  }
}
// ----------------------------------------------------------------------------------------

// 홈 화면 만들기
setHome();

function setHome() {
  let home = document.createElement("div");
  home.setAttribute("class", "home");
  home.innerHTML = `
    <div class="homeHd">
      <div class="hdWrapper">
        <div class="hdTitle">
          <div class="titleImg" style="background-image: url(https://soundpanda.co.kr/icon/tel.png)">
            <a class="telIcon" href="tel:02-1666-0575" target="_blank"></a>
          </div>
          <div class="titleLogo"><img class="logo" src="https://soundpanda.co.kr/icon/logo.png" alt="#"></div>
        </div>
        <div class="hdSubtitle">
          <strong>안녕하세요! '판다봇'입니다.</strong>
          <p>판다에 궁금한 점이 있으신가요?</p>
        </div>
      </div>
      <svg id="closeX" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="closeXBtn blue" defaultOpacity="0.6" hoveredOpacity="1" margintop="0" marginright="0" marginbottom="0"
        marginleft="0">
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
          d="M16.4818 4.69668L15.3033 3.51817L10 8.82147L4.69671 3.51817L3.5182 4.69668L8.8215 9.99998L3.51819 15.3033L4.6967 16.4818L10 11.1785L15.3033 16.4818L16.4818 15.3033L11.1785 9.99998L16.4818 4.69668Z">
        </path>
      </svg>
    </div>
  `;
  let homeContents = document.createElement("div");
  homeContents.setAttribute("class", "homeContents");

  // 로컬스토리지에 uniqeCode 여부 확인
  if (localStorage.getItem("uniqeCode")) {
    // 이전 상담목록 카드 추가
    plusCard();

    // 카드 1번 (신규 상담)
    createCard1();

    // 카드 3번 (인스타그램)
    //createCard3()

    homeContents.append(eScope.addCard, eScope.cardOne, eScope.cardThree);
  } else {
    // 카드 1번 (신규 상담)
    createCard1();

    // 카드 3번 (인스타그램)
    //createCard3()

    homeContents.append(eScope.cardOne, eScope.cardThree);
  }

  home.append(homeContents);
  layout.append(home);

  // 닫기
  closeChat();
}
// ----------------------------------------------------------------------------------------

// 채팅 화면 만들기(code_api)
function chatWindow() {
  // 챗봇시트 코드
  let code = $(".actBtn").attr("data-tcode"),
    code_api = `https://lifezip.co.kr:8443/soundpanda/API?tcode=${code}`;

  this.code = code;
  this.code_api = code_api;

  let homeFrame = $(".home");
  homeFrame.remove();

  let mainBot = document.createElement("div");
  mainBot.setAttribute("class", "bot");

  let botWrpper = document.createElement("div");
  botWrpper.setAttribute("class", "botWrpper");
  mainBot.append(botWrpper);

  let botHead = document.createElement("div");
  botHead.setAttribute("class", "botHd");
  botHead.innerHTML = `
    <div class="hdWrap">
      <div class="backBtnWrap">
        <svg viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"
          class="backBtn" defaultOpacity="1" hoveredOpacity="1" margintop="0" marginright="0" marginbottom="0"
          marginleft="0">
          <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
            d="M9.17255 16.4226C8.84711 16.748 8.31947 16.748 7.99404 16.4226L2.1607 10.5893C1.83527 10.2638 1.83527 9.73619 2.1607 9.41075L7.99404 3.57742C8.31947 3.25198 8.84711 3.25198 9.17255 3.57742C9.49799 3.90285 9.49799 4.43049 9.17255 4.75593L3.92847 10L9.17255 15.2441C9.49799 15.5695 9.49799 16.0972 9.17255 16.4226Z">
          </path>
        </svg>
      </div>
      <div class="logoWrap">
        <div class="logoBox">
          <div class="logo">
            <img class="logo" src="https://soundpanda.co.kr/icon/logo.png" alt="#">
          </div>
        </div>
      </div>
      <div class="closeBtnWrap">
        <div class="XBtnBox">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="closeXBtn" defaultOpacity="1" hoveredOpacity="1" margintop="0" marginright="0" marginbottom="0"
            marginleft="0">
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
              d="M16.4818 4.69668L15.3033 3.51817L10 8.82147L4.69671 3.51817L3.5182 4.69668L8.8215 9.99998L3.51819 15.3033L4.6967 16.4818L10 11.1785L15.3033 16.4818L16.4818 15.3033L11.1785 9.99998L16.4818 4.69668Z">
            </path>
          </svg>
        </div>
      </div>
    </div>
    <div class="hdBorder"></div>
  `;

  let botBody = document.createElement("div");
  botBody.setAttribute("class", "botBd");

  let botFooter = document.createElement("div");
  botFooter.setAttribute("class", "botFt");

  let bdLayer = document.createElement("div");
  bdLayer.setAttribute("class", "bdLayer");
  botBody.append(bdLayer);

  let bdWrap = document.createElement("div");
  bdWrap.setAttribute("class", "bdWrap");
  bdLayer.append(bdWrap);

  let scWrap = document.createElement("div");
  scWrap.setAttribute("class", "scWrap");
  bdWrap.append(scWrap);

  let scChild = document.createElement("div");
  scChild.setAttribute("class", "scChild");
  scWrap.append(scChild);

  let botBdContents = document.createElement("div");
  botBdContents.setAttribute("class", "scInner");
  scChild.append(botBdContents);

  let scHd = document.createElement("div");
  scHd.setAttribute("class", "scHd");
  scHd.innerHTML = `
    <div class="logoBox" style="background-image: url(${logoForm.SP[0].logoImg})"></div>
    <div class="textBox">
      <div class="scTitle">사운드판다에 문의하기</div>
      <div class="scSub">사운드판다 봇이 도와드릴꺼에요!</div>
      <div class="scCau">
        <div class="cauIcon"></div>
        <div class="cauText"></div>
      </div>
    </div>
  `;

  let timerTxt = document.createElement("div");
  timerTxt.setAttribute("class", "timerTxt");

  let scHdBorder = document.createElement("div");
  scHdBorder.setAttribute("class", "scHdBorder");

  $.get(code_api, function (json) {
    let temp = json;
    this.temp = temp;

    // 기본 폼 양식 생성
    createForm(temp);

    // // 버튼 생성
    createBtn(temp);

    // 경계선 생성
    createBorder();

    botBdContents.append(
      scHd,
      timerTxt,
      scHdBorder,
      eScope.massageWrap,
      eScope.btnWrap,
      eScope.msBorder
    );

    // 채팅 시작 시간
    startTime();

    // 답변 시간
    filedMessage();

    // 다음
    next();
  });

  botWrpper.append(botHead, botBody, botFooter);
  layout.append(mainBot);

  // 챗 닫기
  closeChat();

  // 뒤로 가기
  backHome();
}
// ----------------------------------------------------------------------------------------

// 이전 상담목록 채팅화면 만들기(code_api 변경)
function reTurnChat() {
  // 유니크코드 로드
  LoadUniqeCode();

  let code = eScope.uniqeCode,
    code_api = `https://lifezip.co.kr:8443/soundpanda/API?type=GetRecord&ucode=${code}`;

  this.code = code;
  this.code_api = code_api;

  let homeFrame = $(".home");
  homeFrame.remove();

  let mainBot = document.createElement("div");
  mainBot.setAttribute("class", "bot");

  let botWrpper = document.createElement("div");
  botWrpper.setAttribute("class", "botWrpper");
  mainBot.append(botWrpper);

  let botHead = document.createElement("div");
  botHead.setAttribute("class", "botHd");
  botHead.innerHTML = `
    <div class="hdWrap">
    <div class="backBtnWrap">
      <svg viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="backBtn" defaultOpacity="1" hoveredOpacity="1" margintop="0" marginright="0" marginbottom="0"
        marginleft="0">
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
          d="M9.17255 16.4226C8.84711 16.748 8.31947 16.748 7.99404 16.4226L2.1607 10.5893C1.83527 10.2638 1.83527 9.73619 2.1607 9.41075L7.99404 3.57742C8.31947 3.25198 8.84711 3.25198 9.17255 3.57742C9.49799 3.90285 9.49799 4.43049 9.17255 4.75593L3.92847 10L9.17255 15.2441C9.49799 15.5695 9.49799 16.0972 9.17255 16.4226Z">
        </path>
      </svg>
    </div>
    <div class="logoWrap">
      <div class="logoBox">
        <div class="logo">
          <img class="logo" src="https://soundpanda.co.kr/icon/logo.png" alt="#">
        </div>
      </div>
    </div>
    <div class="closeBtnWrap">
      <div class="XBtnBox">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
          class="closeXBtn" defaultOpacity="1" hoveredOpacity="1" margintop="0" marginright="0" marginbottom="0"
          marginleft="0">
          <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
            d="M16.4818 4.69668L15.3033 3.51817L10 8.82147L4.69671 3.51817L3.5182 4.69668L8.8215 9.99998L3.51819 15.3033L4.6967 16.4818L10 11.1785L15.3033 16.4818L16.4818 15.3033L11.1785 9.99998L16.4818 4.69668Z">
          </path>
        </svg>
      </div>
    </div>
  </div>
  <div class="hdBorder"></div>
  `;

  let botBody = document.createElement("div");
  botBody.setAttribute("class", "botBd");

  let botFooter = document.createElement("div");
  botFooter.setAttribute("class", "botFt");

  let bdLayer = document.createElement("div");
  bdLayer.setAttribute("class", "bdLayer");
  botBody.append(bdLayer);

  let bdWrap = document.createElement("div");
  bdWrap.setAttribute("class", "bdWrap");
  bdLayer.append(bdWrap);

  let scWrap = document.createElement("div");
  scWrap.setAttribute("class", "scWrap");
  bdWrap.append(scWrap);

  let scChild = document.createElement("div");
  scChild.setAttribute("class", "scChild");
  scWrap.append(scChild);

  let botBdContents = document.createElement("div");
  botBdContents.setAttribute("class", "scInner");
  scChild.append(botBdContents);

  let scHd = document.createElement("div");
  scHd.setAttribute("class", "scHd");
  scHd.innerHTML = `
    <div class="logoBox" style="background-image: url(${logoForm.SP[0].logoImg})"></div>
    <div class="textBox">
      <div class="scTitle">사운드판다에 문의하기</div>
      <div class="scSub">사운드판다 봇이 도와드릴꺼에요!</div>
      <div class="scCau">
        <div class="cauIcon"></div>
        <div class="cauText"></div>
      </div>
    </div>
  `;

  let timerTxt = document.createElement("div");
  timerTxt.setAttribute("class", "timerTxt");

  let scHdBorder = document.createElement("div");
  scHdBorder.setAttribute("class", "scHdBorder");

  botBdContents.append(scHd, timerTxt, scHdBorder);

  $.get(code_api, function (json) {
    let uniqeTemp = json;
    this.uniqeTemp = uniqeTemp;

    // tName 배열 만들기
    let tNameArr = new Array();
    for (i = 1; i < uniqeTemp.length; i++) {
      let tName = uniqeTemp[i].tName;
      tNameArr[i] = tName;
    }

    let count = uniqeTemp.length,
      lastCount = count - 1;

    for (i = 0; i < count; i++) {
      let borderInner = document.querySelector(".scInner"),
        mborderLast = borderInner.lastChild;

      // 기본 폼 양식 생성
      createForm(uniqeTemp[i]);

      let lastTcode = uniqeTemp[i].tCode;

      // 버튼 만들기
      if (i !== lastCount) {
        returnChatBtn(tNameArr[i + 1]);

        createBorder();

        mborderLast.after(eScope.massageWrap, eScope.btnWrap, eScope.msBorder);
      } else {
        // 마지막 순번 버튼 만들기
        if (lastTcode == "0015") {
          // input 생성
          createInput(uniqeTemp[i]);

          // 경계선 생성
          createBorder();

          mborderLast.after(
            eScope.massageWrap,
            eScope.inputMs,
            eScope.msBorder
          );

          // input (이름칸, 번호칸 정규표현식 일치)
          wordMatch();

          // A/S접수데이터 전송
          startData();
        } else {
          // 버튼 생성
          createBtn(uniqeTemp[i]);

          // 경계선 생성
          createBorder();

          mborderLast.after(
            eScope.massageWrap,
            eScope.btnWrap,
            eScope.msBorder
          );
        }
      }
    }

    // 채팅 시작 시간
    startTime();

    // 답변 시간
    filedMessage();

    // 다음
    next();

    // 홈으로 돌아가기
    reHome();
  });

  botWrpper.append(botHead, botBody, botFooter);
  layout.append(mainBot);

  // 챗 닫기
  closeChat();

  // 뒤로 가기
  backHome();
}
