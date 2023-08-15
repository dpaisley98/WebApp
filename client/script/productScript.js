(function ($) {
    $(document).ready(function() {

        // Get the form element
        const form = $("#search-criteria");

    // Add a submit event listener to the form
        form.on("submit", (event) => {
            // Prevent the form from submitting normally
            event.preventDefault();

            // Hide the table until it is fully populated
            $("#products-table").delay(2000).hide();
            // Clear the table
            $("#products-table tbody").empty();
            // Show a spinner which will spin for a few seconds until the content has loaded
            showSpinner();
            hideSpinnerWithDelay();

            // Get the values of the input fields and checkboxes
            const searchInput = $("#search-input").val();
            const minPriceInput = $("#min-price-input").val();
            const maxPriceInput = $("#max-price-input").val();
            const titleCheckbox = $("#product-categories input[type=checkbox]:eq(0)").prop("checked");
            const brandCheckbox = $("#product-categories input[type=checkbox]:eq(1)").prop("checked");
            const descriptionCheckbox = $("#product-categories input[type=checkbox]:eq(2)").prop("checked");
            const categoryCheckbox = $("#product-categories input[type=checkbox]:eq(3)").prop("checked");

            // Create the filter object
            const filter = {};
            if (minPriceInput || maxPriceInput) {
                filter.price = {};
                if (minPriceInput) {
                    filter.price.$gte = parseInt(minPriceInput);
                }
                if (maxPriceInput) {
                    filter.price.$lte = parseInt(maxPriceInput);
                }
            }
            if (titleCheckbox) {
                filter.title = true;
            }
            if (brandCheckbox) {
                filter.brand = true;
            }
            if (descriptionCheckbox) {
                filter.description = true;
            }
            if (categoryCheckbox) {
                filter.category = true;
            }

            searchedProducts(filter, searchInput);
        });

        $("#create-product").click(function () {
            window.location.href = `./product_create.html`;
        })

        searchedProducts({}, "undefined");

        $("#products-table tbody").on("click", "tr", function() {
            const productId = $(this).find("td:eq(7)").text();
            getNewProduct({id: parseInt(productId)});
        });
    });

    function showSpinner() {
        $('#spinner').show();
        $('body').css('overflow', 'hidden');
        $(document).on('keydown keyup keypress click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    function hideSpinnerWithDelay() {
        setTimeout(function() {
            $('#spinner').hide();
            $("#table-status").text("Table has loaded after 5 seconds.");
        }, 2000);
        $('body').css('overflow', '');
        $(document).off('keydown keyup keypress click');
    }

    function getNewProduct(filter) {
        $.ajax({
            url: `/products?filter=${encodeURIComponent(JSON.stringify(filter))}`,
            method: 'GET',
            success: (product) => {
                console.log(product);
                const productsString = JSON.stringify(product);
                Cookies.set('filteredProducts', productsString);
                window.location.href = `./product_modify.html?products=${encodeURIComponent(productsString)}`;
            },
            error: (error) => console.log(error)
        });
    }

    function searchedProducts(filter, searchInput) {
        $("#products-table").delay(2000).hide();
        // Clear the table
        $("#products-table tbody").empty();
        // Show a spinner which will spin for a few seconds until the content has loaded
        showSpinner();
        hideSpinnerWithDelay();

        $.ajax({
            url: `/products?filter=${encodeURIComponent(JSON.stringify(filter))}&search=${encodeURIComponent(searchInput)}`,
            method: 'GET',
            success: (products) => {
                console.log(products);
                // Loop through the colours
                for(let i = 0; i < products.length; i++){
                    // Create a row for each colour and append it to the table
                    const row = $("<tr>");
                    const productsImg = $("<img>");
                    productsImg.attr("src", products[i]["thumbnail"]);
                    row.append($("<td>").append(productsImg));
                    row.append($("<td>").text(products[i]["title"]));
                    row.append($("<td>").text(products[i]["brand"]));
                    row.append($("<td>").text(products[i]["category"]));
                    row.append($("<td>").text(products[i]["price"]));
                    row.append($("<td>").text(products[i]["discountPercentage"]));
                    row.append($("<td>").text(products[i]["rating"]));
                    row.append($("<td hidden>").text(products[i]["id"]));

                    $("#products-table tbody").append(row);
                }
                $("#products-table").fadeIn(500);
            },
            error: (error) => console.log(error)
        });
    }
})(jQuery);