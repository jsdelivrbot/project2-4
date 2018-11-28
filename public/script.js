$(document).ready(function () {

    $(document).on("click", "#getParent", function () {
        //alert("clicked Parent");
        //write ajax funxtion to return list of id's of parents and then call getPerson on the parents to display names
           //$.ajax({
           //     url: 'http://192.168.1.103:8124/',
           //     dataType: "jsonp",
           //     jsonpCallback: "_testcb",
           //     cache: false,
           //     timeout: 5000,
           //     success: function (data) {
           //         $("#test").append(data);
           //     },
           //     error: function (jqXHR, textStatus, errorThrown) {
           //         alert('error ' + textStatus + " " + errorThrown);
           //     }
           // });
    });

    $(document).on("click", "#getChildren", function () {
        //alert("clicked Children");
        //write ajax funxtion to return list of id's of children and then call getPerson on the children to display names
        //$.ajax({
        //    url: 'http://192.168.1.103:8124/',
        //    dataType: "jsonp",
        //    jsonpCallback: "_testcb",
        //    cache: false,
        //    timeout: 5000,
        //    success: function (data) {
        //        $("#test").append(data);
        //    },
        //    error: function (jqXHR, textStatus, errorThrown) {
        //        alert('error ' + textStatus + " " + errorThrown);
        //    }
        //});
    });
});