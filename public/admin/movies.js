$(function () {
  var present;
  let add_db = $("#add_db");
  add_db.click(function () {
    let data = {
      title: document.getElementById("movieTitle").value,
    };
    console.log(data.title);

    $.ajax({
      type: "POST",
      url: "http://localhost:3103/check_movie_in_db",
      data: data,
      success: function () {
        console.log("done");
      },
      error: () => {
        console.log("error");
      },
    });

    setTimeout(() => {
      fetch("http://localhost:3103/present_val")
        .then((response) => response.text())
        .then((response) => {
          console.log(typeof response + " lol");
          present = response.toString();
          console.log(present + " present");
        })
        .catch((err) => console.log("err"));
    }, 400);
    setTimeout(() => {
      let language = "";
      if ($("#hindi").is(":checked")) language += "Hindi ";
      if ($("#english").is(":checked")) language += "English ";
      if ($("#punjabi").is(":checked")) language += "Punjabi ";
      if ($("#marathi").is(":checked")) language += "Marathi ";
      if ($("#telugu").is(":checked")) language += "Telugu ";
      if ($("#tamil").is(":checked")) language += "Tamil ";
      if ($("#kannada").is(":checked")) language += "Kannada ";
      console.log(language);
      
      let platform = "";
      if ($("#netflix").is(":checked")) language += "NETFLIX ";
      if ($("#amazon").is(":checked")) language += "Amazon Prime ";
      if ($("#youtube").is(":checked")) language += "Youtube ";
      if ($("#imdb").is(":checked")) language += "IMDB TV ";
      if ($("#hotstar").is(":checked")) language += "Hotstar ";
      if ($("#sonyliv").is(":checked")) language += "Sony Liv ";
      if ($("#hbo").is(":checked")) language += "HBO max ";
      if ($("#hulu").is(":checked")) language += "Hulu";
      console.log(platform);

      let plot = $("#comment").val();
      let popularity = $("#popularity").val();
      let rating = parseInt($("#number").val());
      let datee = $("#date").val();
      let monthh = $("#month").val();
      let yearr = $("#year").val();
      datee =
        yearr.toString() + "-" + monthh.toString() + "-" + datee.toString();
      console.log(typeof present + "kkkk");
      if (present === "0") {
        console.log("in here");
        let data = {
          title: document.getElementById("movieTitle").value,
          language: language,
          plot: plot,
          release_date: datee,
          month: monthh,
          year: yearr,
          rating: rating,
        };
        $.ajax({
          type: "POST",
          url: "http://localhost:3103/add_movie",
          data: data,
          success: function () {
            console.log("done");
          },
          error: () => {
            console.log("error");
          },
        });
      }
    }, 1000);
    setTimeout(function () {
      console.log("clicked");
      window.location.href = "staff.html";
    }, 1500);
  });
});
