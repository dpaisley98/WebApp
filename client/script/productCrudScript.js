(function ($) {
    let slideIndex = 1;
    $(document).ready(function() {
        $("#reset-edit").val("Clear");

        const queryString = window.location.search;
        let productId;

        if(queryString !== "") {
            const urlParams = new URLSearchParams(queryString);
            const productsString = urlParams.get('products');
            const products = JSON.parse(decodeURIComponent(productsString));
            console.log(products[0]["brand"]);
            productId = products[0]["_id"];

            $("#product-title").val(products[0]["title"]);
            $("#product-description").val(products[0]["description"]);
            $("#product-price").val(products[0]["price"]);
            $("#product-discount").val(products[0]["discountPercentage"]);
            $("#product-rating").val(products[0]["rating"]);
            $("#product-stock").val(products[0]["stock"]);
            $("#product-brand").val(products[0]["brand"]);
            $("#product-category").val(products[0]["category"]);

            const slideShowDiv = $("#slide-show-div");

            products[0]["images"].forEach( image => {
                console.log(image);
                const productImg = $("<img>");
                productImg.attr("src", image);
                productImg.addClass("mySlides");
                slideShowDiv.append(productImg);
            });

            showDivs(slideIndex);
        }

        $("#edit-product").click(function () {
            $("#new-product-title").val($("#product-title").val());
            $("#new-product-description").val($("#product-description").val());
            $("#new-product-price").val($("#product-price").val());
            $("#new-product-discount").val($("#product-discount").val());
            $("#new-product-rating").val($("#product-rating").val());
            $("#new-product-stock").val($("#product-stock").val());
            $("#new-product-brand").val($("#product-brand").val());
            $("#new-product-category").val($("#product-category").val());

            $("#product-details, #editable-product-info, #color-options, #confirm-colour-edit").show();
            $("#product-info").hide();
        });

        $("#confirm-edit").click(function () {
            const updatedProduct = getProductDetails();

            $.ajax({
                url: `/products?id=${encodeURIComponent(JSON.stringify(productId))}`,
                method: 'PUT',
                data: updatedProduct,
                success: function(result) {
                    alert("Product successfully created.")
                    window.location.href = `./`;
                },
                error: function(err) {
                    console.error(err);
                }
            });

            // Reset all fields
            resetFields();
            $("#editable-product-info").hide();
            $("#colour-info").show();
        });

        $("#prev-image").click(function () {
            plusDivs(-1);
        })

        $("#next-image").click(function () {
            plusDivs(1);
        })

        // Delete the product by _id
        $("#delete-product").click(function () {
            $.ajax({
                url: `/products/${productId}`,
                method: 'DELETE',
                success: function(result) {
                    window.location.href = `./`;
                },
                error: function(xhr, textStatus) {
                    console.log(xhr.responseText + "," + textStatus); // handle errors or display error messages to the user
                }
            });

            // Reset all fields
            resetFields();
        });

        $("#confirm-create").click(function () {
            // Create the color object
            const newProduct = getProductDetails();

            $.ajax({
                url: '/products',
                method: 'POST',
                data: newProduct,
                success: function(result) {
                    console.log("dcascwascx");
                    alert("Product successfully created.");
                    window.location.href = `./`;
                },
                error: function(err) {
                    console.error(err);
                }
            });

            $("#editable-product-info, #color-options").hide();
            $("#colour-info").show();
        });
    });

    function resetFields() {
        $("#color-id, #hidden-color-id").val("");
        $("#rgb, #rgb-value").val("");
        $("#hsl, #hsl-value").val("");
        $("#hex, #hex-value").val("");
        $("#color-name, #new-color-name").val("");
        $("#color-box").css("background-color", "#ffffff");
    }

    function getProductDetails() {
        const titleValue = $("#new-product-title").val();
        const descriptionValue = $("#new-product-description").val();
        const priceValue = Number($("#new-product-price").val());
        const discountPercentageValue = Number($("#new-product-discount").val());
        const ratingValue = Number($("#new-product-rating").val());
        const stockValue = Number($("#new-product-stock").val());
        const brandValue = $("#new-product-brand").val();
        const categoryValue = $("#new-product-category").val();
        const thumbnailUrlValue = $("#new-product-thumbnail").val();
        const imageUrlValues = $("#new-product-images").val();

        let imageUrls;
        if (imageUrlValues && imageUrlValues !== "") {
            imageUrls = imageUrlValues.split(",");
        } else {
            imageUrls = [];
        }

        // Create the product object
        return {
            title: titleValue,
            description: descriptionValue,
            price: priceValue,
            discountPercentage: discountPercentageValue,
            rating: ratingValue,
            stock: stockValue,
            brand: brandValue,
            category: categoryValue,
            thumbnail: thumbnailUrlValue,
            images: imageUrls
        };
    }

    function plusDivs(n) {
        showDivs(slideIndex += n);
    }

    function showDivs(n) {
        let i;
        const x = document.getElementsByClassName("mySlides");
        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "block";
    }
})(jQuery);