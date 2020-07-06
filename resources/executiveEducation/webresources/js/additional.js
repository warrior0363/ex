$(document).ready(function () {
    /*Variables*/
    let $button = $("#homePageSliderSearch_submitButton");
    let courseFinderURLRedirect = $button.data("href");
    let $homePageSearch = $(".homePageSliderSearch_dropdown");
    let $searchField = $("#search-field-CF");
    let $sortedTitle = $("#sortedTitle");
    let $speakersSeeAllButton = $("#speakersSeeAll");
    let $loadMoreButton = $(".loadMoreButton");
    let $upcomingSeminars = $(".js-upcomingSeminars");
    let $newsletterButton = $("#homePage_signUpButton");

    $newsletterButton.on("click", function() {
        $("#newsletter-modal").show();
    });

    $upcomingSeminars.each(function () {
        let upcomingCourseIndex = $(this).data('upcomingcourseid');
        if (upcomingCourseIndex > 6) {
            $(this).hide();
            $loadMoreButton.show();
        } else {
            $loadMoreButton.hide();
        }

    });
    $loadMoreButton.on("click", function () {
        $upcomingSeminars.each(function () {
            $(this).show();
        });
        $(this).hide();
    });

    /*Functions*/
    function getQueryParameters() {
        let queryString = window.location.search || '';
        let keyValPairs = [];
        let params = {};
        queryString = queryString.replace(/.*?\?/, "");
        if (queryString.length) {
            keyValPairs = queryString.split('&');
            for (let pairNum in keyValPairs) {
                let key = keyValPairs[pairNum].split('=')[0];
                if (!key.length) continue;
                if (typeof params[key] === 'undefined')
                    params[key] = [];
                params[key].push(keyValPairs[pairNum].split('=')[1]);
            }
        }
        return params;
    }

    function getDataFromParentRecursive($element) {
        let $parent = $element.parent();
        if ($parent.data("name") !== undefined) {
            return $parent.data("name");
        } else {
            return getDataFromParentRecursive($parent);
        }
    }

    function getSelectedElementsData() {
        return $(".clickedEl").map(function () {
            let $listElement = $(this).children(".dropdown-title").first();
            let $value = null;

            if ($listElement.data("dropdowntype") === 6) {
                $value = $listElement.data("month");
            } else {
                $value = $listElement.data("value");
            }

            let $name = getDataFromParentRecursive($(this));

            return {name: $name, value: $value};
        });
    }

    function buildQueryString() {
        let queryString = "?";
        queryString += loadFiltersString();
        let searchValue = $searchField.val();
        if (searchValue === '') {
            searchValue = "~~";
        }
        queryString = addAmpersandIfNecessary(queryString);
        queryString += "searchQuery=" + searchValue;
        queryString = addAmpersandIfNecessary(queryString);
        let sortValue = $sortedTitle.data('value');
        queryString += "sortQuery=" + sortValue;

        return queryString;
    }

    function addAmpersandIfNecessary(queryString) {
        if (queryString !== "?") {
            queryString += "&"
        }
        return queryString;
    }

    function loadFiltersString() {
        let queryString = "";
        let $filtersData = getSelectedElementsData();
        for (let index = 0; index < $filtersData.length; index++) {
            if (index === 0) {
                queryString += $filtersData[index].name + "=" + $filtersData[index].value;
            } else {
                queryString = addAmpersandIfNecessary(queryString);
                queryString += $filtersData[index].name + "=" + $filtersData[index].value;
            }
        }
        return queryString;
    }

    function loadFavouritesString() {
        let queryString = "";
        let $filtersData = getSelectedFavouritesData();
        for (let index = 0; index < $filtersData.length; index++) {
            if (index === 0) {
                queryString += "goid" + "=" + $filtersData[index].value;
            } else {
                queryString = addAmpersandIfNecessary(queryString);
                queryString += "goid" + index + "=" + $filtersData[index].value;
            }
        }
        return queryString;
    }


    /*Functions End*/


    /*Home Page Search*/
    $homePageSearch.on("click", function () {
        let $data = getSelectedElementsData();
        let $queryURL = $button.data("query");
        let language = $("#language").data("language");
        $.ajax({
            type: "GET",
            url: $queryURL,
            data: $data,
            success: function (successData) {
                if (language === "de") {
                    $button.text(successData + " Ergebnisse ansehen");
                } else {
                    $button.text("view" + " " + successData + " " + "results");
                }
            },
            error: function () {
                console.log("loading error - ajax");
            }
        });
    });

    $button.on("click", function () {
        let queryString = "?";
        queryString += loadFiltersString();
        if (queryString === "?") {
            queryString = '';
        }
        window.location.href = courseFinderURLRedirect + queryString;
    });
    /*End Home Page Search*/


    $(".speaker").slice(0, 6).show();
    $speakersSeeAllButton.on('click', function (e) {
        e.preventDefault();
        $(".speaker:hidden").slice(0, 6).slideDown();
        if ($(".speaker:hidden").length == 0) {
            $speakersSeeAllButton.hide();
        }
        $('html,body').animate({
            scrollTop: $(this).offset().bottom
        }, 800);
    });

    $("#first-dropdown li").each(function () {
        $(this).on("click", function () {
            let $length = $("#first-dropdown .clickedEl").length;
            let language = $("#language").data("language");
            if ($length !== 0) {
                $(".first-dropdown-label").text("");
                if ($length === 1) {
                    $(".first-dropdown-size").text($length + " " + "Level");
                } else {
                    $(".first-dropdown-size").text($length + " " + "Levels");
                }
            } else {
                if (language === "en") {
                    $(".first-dropdown-size").text("some Level");
                } else {
                    $(".first-dropdown-size").text("irgendein Level");
                }
            }
        });
    });

    $("#second-dropdown li").each(function () {
        $(this).on("click", function () {
            let $length = $("#second-dropdown .clickedEl").length;
            let language = $("#language").data("language");
            if ($length !== 0) {
                $(".second-dropdown-label").text("");
                if ($length === 1){
                    if (language === "en") {
                        $(".second-dropdown-size").text($length + " " + "Topic");
                    } else {
                        $(".second-dropdown-size").text($length + " " + "Thema");
                    }

                } else {
                    if (language === "en") {
                        $(".second-dropdown-size").text($length + " " + "Topics");
                    } else {
                        $(".second-dropdown-size").text($length + " " + "Themen");
                    }
                }

            } else {
                if (language === "en") {
                    $(".second-dropdown-size").text("all Topics");
                } else {
                    $(".second-dropdown-size").text("allen Themen");
                }
            }
        });
    });

    $("#third-dropdown li").each(function () {
        $(this).on("click", function () {
            let $length = $("#third-dropdown .clickedEl").length;
            let language = $("#language").data("language");
            if ($length !== 0) {
                $(".third-dropdown-label").text("");
                if ($length === 1){
                    if (language === "en") {
                        $(".third-dropdown-size").text($length + " " + "Format");
                    } else {
                        $(".third-dropdown-size").text($length + " " + "Format");
                    }

                } else {
                    if (language === "en") {
                        $(".third-dropdown-size").text($length + " " + "Formats");
                    } else {
                        $(".third-dropdown-size").text($length + " " + "Formaten");
                    }
                }

            } else {
                if (language === "en") {
                    $(".third-dropdown-size").text("all Formats");
                } else {
                    $(".third-dropdown-size").text("allen Formaten");
                }
            }
        });
    });

    $('textarea').each(function(){
            $(this).val($(this).val().trim());
        }
    );

    function disableSpecificTopicForEnInCourseFinderPage() {
        let $dropdownElements = $('.dropdown-topics-menu-CF li, .dropdown-menu-CF li');
        let language = $("#language").data("language");
        $.each($dropdownElements, function () {
            let $elementValue = $(this).find("p").data("value").toString();
            if (language === "en" && $elementValue === "9134") {
                $(this).addClass("displayNode");
            } else {
                $(this).removeClass("displayNode");
            }
        });
    }

    function disableSpecificTopicForEnInHomePage() {
        let $dropdownElements = $('.homePageSliderSearch_dropdown li');
        let language = $("#language").data("language");
        $.each($dropdownElements, function () {
            let $elementValue = $(this).find("p").data("value").toString();
            if (language === "en" && $elementValue === "9134") {
                $(this).addClass("displayNode");
            } else {
                $(this).removeClass("displayNode");
            }
        });
    }

    disableSpecificTopicForEnInCourseFinderPage();
    disableSpecificTopicForEnInHomePage();


    $('.topic-inputs').on('click', function(e) {

        var preselectedTopicIds = $("#category_ids").val();
        var preselectedTopicNames = $("#main_category").val();

        preselectedTopicNames = preselectedTopicNames.split(";");
        preselectedTopicIds = preselectedTopicIds.split(";");


        var radioButtonVal = $(this).find('input').val();
        var categoryId = $(this).find('input').data('categoryid');

        var index = preselectedTopicNames.indexOf(radioButtonVal);
        var catIndex = preselectedTopicIds.indexOf(categoryId);

        if (catIndex > -1) {
            preselectedTopicIds.splice(catIndex, 1);
        }else {
            preselectedTopicIds.push(categoryId);
        }

        if (index > -1) {
            // This deselected radio button
            preselectedTopicNames.splice(index, 1);
            $(this).find('input').attr("checked", false);
        } else {
            // This selected radio button
            preselectedTopicNames.push(radioButtonVal);
            $(this).find('input').attr("checked", true);

        }

        preselectedTopicIds = preselectedTopicIds.join(";");
        preselectedTopicNames = preselectedTopicNames.join(";");
        $("#main_category").val(preselectedTopicNames);
        $("#category_ids").val(preselectedTopicIds);
        e.preventDefault();
    });


    // Trigger chat on click
    $(document).ready(function () {
        $("#chat").on('click', function () {
            $("#userlike-eyecatcher").trigger('click', true);
        });
    });

});

window.setInterval(function(){
    var parentClass = $(".userlike");

    if (parentClass.length > 0) {
        var detectId = $("#userlike-eyecatcher-picture");
        var detectedElStyle = detectId.attr("style");
        if (detectedElStyle !== undefined) {
            $("#chat .status").text("Online");
            $("#userlike-eyecatcher").hide();
            $("#userlike-tab").hide();
            $("#userlike-eyecatcher-box").hide();
        } else {
            $("#chat .status").text("Offline");
        }
    } else {
        $("#chat .status").text("Offline");
    }
}, 2000);
