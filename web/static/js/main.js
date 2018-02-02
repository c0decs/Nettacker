// check for session key
$(document).ready(function () {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
    // hide set session key
    $("#set_session").hide();

    //check session key
    $.ajax({
        type: "GET",
        url: "/session/check",
        dataType: "text"
    }).done(function (res) {
        $("#set_session").addClass("hidden");
        $("#set_session").hide();
        $("#logout_btn").removeClass("hidden");
        $("#logout_btn").show();

    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#set_session").removeClass("hidden");
        $("#set_session").show();
        $("#logout_btn").addClass("hidden");
        $("#logout_btn").hide();
    });

    // set session key
    $("#session_value").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#send_session").click();
        }
    });
    $("#send_session").click(function () {
        var key = "/session/set?key=" + $("#session_value").val();
        $.ajax({
            type: "GET",
            url: key,
            dataType: "text"
        }).done(function (res) {
            $("#set_session").hide();
            $("#success_key").removeClass("hidden");
            setTimeout("$(\"#success_key\").addClass(\"animated fadeOut\");", 5000);
            setTimeout("$(\"#success_key\").addClass(\"hidden\");", 5000);
            $("#logout_btn").removeClass("hidden");
            $("#logout_btn").show();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $("#set_session").hide();
            $("#failed_key").removeClass("hidden");
            setTimeout("$(\"#failed_key\").addClass(\"hidden\");", 5000);
            $("#set_session").show();
        });
    });

    $("#logout_btn").click(function () {
        $.ajax({
            type: "GET",
            url: "/session/kill",
            dataType: "text"
        }).done(function (res) {
            $("#session_value").val("");
            $("#logout_btn").addClass("hidden");
            $("#logout_btn").hide();
            $("#set_session").removeClass("hidden");
            $("#set_session").show();
            $("#logout_success").removeClass("hidden");
            setTimeout("$(\"#logout_success\").addClass(\"animated fadeOut\");", 1000);
            setTimeout("$(\"#logout_success\").addClass(\"hidden\");", 1500);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // codes
        });
    });


    $("#home_btn").click(function () {
        $("#new_scan").addClass("hidden");
        $("#get_results").addClass("hidden");
        $("#home").removeClass("hidden");
    });

    $("#new_scan_btn").click(function () {
        $("#home").addClass("hidden");
        $("#get_results").addClass("hidden");
        $("#new_scan").removeClass("hidden");
    });

    $("#results_btn").click(function () {
        $("#home").addClass("hidden");
        $("#new_scan").addClass("hidden");
        $("#get_results").removeClass("hidden");
    });


    $("#submit_new_scan").click(function () {

        // set variables
        // check ranges
        if (document.getElementById('check_ranges').checked) {
            var p_1 = true;
        } else {
            var p_1 = false;
        }
        // ping before scan
        if (document.getElementById('ping_flag').checked) {
            var p_2 = true;
        } else {
            var p_2 = false;
        }
        // subdomains
        if (document.getElementById('check_subdomains').checked) {
            var p_3 = true;
        } else {
            var p_3 = false;
        }
        // profiles
        var p = []
        var n = 0;
        $('#profile input:checked').each(function () {
            p[n] = this.id;
            n += 1;
        });
        var profile = p.join(",");

        // scan_methods
        n = 0;
        sm = []
        $('#scan_method input:checked').each(function () {
            sm[n] = this.id;
            n += 1;
        });
        var scan_method = sm.join(",")
        // language
        var language = "";
        $('#languages option:selected').each(function () {
            language = this.id;
        });

        // graph_flag
        var graph_flag = "";
        $('#graph_flags input:checked').each(function () {
            graph_flag = this.id;
        });


        // build post data
        var tmp_data = {
            targets: $("#targets").val(),
            profile: profile,
            scan_method: scan_method,
            graph_flag: graph_flag,
            language: language,
            log_in_file: $("#log_in_file").val(),
            check_ranges: p_1,
            check_subdomains: p_3,
            ping_flag: p_2,
            thread_number: $("#thread_number").val(),
            thread_number_host: $("#thread_number_host").val(),
            retries: $("#retries").val(),
            time_sleep: $("#time_sleep").val(),
            timeout_sec: $("#timeout_sec").val(),
            verbose_level: $("#verbose_level").val(),
            ports: $("#ports").val(),
            socks_proxy: $("#socks_proxy").val(),
            users: $("#users").val(),
            passwds: $("#passwds").val(),
            methods_args: $("#methods_args").val().replaceAll("\n", "&"),

        };

        // replace "" with null
        var key = "";
        var data = {};
        for (key in tmp_data) {
            if (tmp_data[key] != "" && tmp_data[key] != false && tmp_data[key] != null) {
                data[key] = tmp_data[key];
            }
        }

        $.ajax({
            type: "POST",
            url: "/new/scan",
            data: data,
        }).done(function (res) {
            var results = JSON.stringify(res);
            results = results.replaceAll(",", ",<br>");
            document.getElementById('success_msg').innerHTML = results;
            $("#success_request").removeClass("hidden");
            setTimeout("$(\"#success_request\").addClass(\"animated fadeOut\");", 5000);
            setTimeout("$(\"#success_request\").addClass(\"hidden\");", 6000);
            $("#success_request").removeClass("animated fadeOut");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            document.getElementById('error_msg').innerHTML = jqXHR.responseText;
            if (errorThrown == "BAD REQUEST") {
                $("#failed_request").removeClass("hidden");
                setTimeout("$(\"#failed_request\").addClass(\"hidden\");", 5000);
            }
            if (errorThrown == "UNAUTHORIZED") {
                $("#failed_request").removeClass("hidden");
                setTimeout("$(\"#failed_request\").addClass(\"hidden\");", 5000);
            }
        });

    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };


    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function show_scans(res) {
        res = JSON.parse(res);
        var HTMLData = "";
        var i;
        var id;
        var date;
        var scan_id;
        var report_filename;
        var events_num;
        var verbose;
        var api_flag;
        var report_type;
        var graph_flag;
        var category;
        var profile;
        var scan_method;
        var language;
        var scan_cmd;
        var ports;

        for (i = 0; i < res.length; i++) {
            id = res[i]["id"];
            date = res[i]["date"];
            scan_id = res[i]["scan_id"];
            report_filename = res[i]["report_filename"];
            events_num = res[i]["events_num"];
            verbose = res[i]["verbose"];
            api_flag = res[i]["api_flag"];
            report_type = res[i]["report_type"];
            graph_flag = res[i]["graph_flag"];
            category = res[i]["category"];
            profile = res[i]["profile"];
            scan_method = res[i]["scan_method"];
            language = res[i]["language"];
            scan_cmd = res[i]["scan_cmd"];
            ports = res[i]["ports"];
            HTMLData += "<a target='_blank' href=\"/results/get?id=" + id + "\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\n" +
                "                        <div class=\"row\" ><div class=\"d-flex w-100 text-justify justify-content-between\">\n" +
                "                            <h3  class=\"mb-1\">&nbsp;&nbsp;&nbsp;<span id=\"logintext\"\n" +
                "                      class=\"bold label label-primary\">" + id + "</span>&nbsp;&nbsp;&nbsp;<small class=\"label label-info\">" + date + "</small></h3>\n" +
                "                        </div></div>\n" + "<p class=\"mb-1\"> " +
                "<p class='mb-1  bold label label-danger'>scan_id:" + scan_id + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1  bold label label-info'>report_filename:" + report_filename + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1 bold label label-success'>events_num:" + events_num + "</p>&nbsp;&nbsp;&nbsp;" +
                "<p class='mb-1 bold label label-danger'>ports:" + ports + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1 bold label label-info'>category:" + category + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1 bold label label-success'>profile:" + profile + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1 bold label label-warning'>scan_method:" + scan_method + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1 bold  label label-primary'>api_flag:" + api_flag + "</p>&nbsp;&nbsp;&nbsp;" +
                "<p class='mb-1 bold label label-warning'>verbose:" + verbose + "</p>&nbsp;&nbsp;&nbsp;" +
                "<p class='mb-1 bold label label-info'>report_type:" + report_type + "</p>&nbsp;&nbsp;&nbsp;" +
                "<p class='mb-1 bold label label-primary'>graph_flag:" + graph_flag + "</p>&nbsp;&nbsp;&nbsp;" +
                "<p class='mb-1 bold label label-success'>language:" + language + "</p>&nbsp;&nbsp;&nbsp;<br>" +
                "<p class='mb-1 bold label label-default'>scan_cmd:" + scan_cmd + "</p>&nbsp;&nbsp;&nbsp;" +

                "                   </p>\n </a>";
        }
        document.getElementById('scan_results').innerHTML = HTMLData;

    }


    function get_results_list(page) {
        $.ajax({
            type: "GET",
            url: "/results/get_list?page=" + page,
            dataType: "text"
        }).done(function (res) {
            $("#login_first").addClass("hidden");
            $("#scan_results").removeClass("hidden");
            $("#refresh_btn").removeClass("hidden");
            $("#nxt_prv_btn").removeClass("hidden");
            show_scans(res);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (errorThrown == "UNAUTHORIZED") {
                $("#login_first").removeClass("hidden");
                $("#scan_results").addClass("hidden");
                $("#refresh_btn").addClass("hidden");
                $("#nxt_prv_btn").addClass("hidden");
            }
            else {
                $("#login_first").addClass("hidden");
                $("#scan_results").removeClass("hidden");
                $("#refresh_btn").removeClass("hidden");
                $("#nxt_prv_btn").removeClass("hidden");
            }
        });
    }


    $("#results_btn").click(function () {
        page = 1;
        get_results_list(page);
    });

    $("#refresh_btn_update").click(function () {
        page = 1;
        get_results_list(page);
    });

    $("#refresh_btn_page").click(function () {
        get_results_list(page);
    });

    $("#previous_btn").click(function () {
        page = page - 1;
        get_results_list(page);
    });

    $("#next_btn").click(function () {
        page = page + 1;
        get_results_list(page);
    });

});
