$(function() {
    var x, i, j, l, ll, selElmnt, a, b, c, d;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("select");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        d = document.createElement("DIV");
        d.setAttribute("class", "select-items-container");
        for (j = 1; j < ll; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            selElmnt.options[j]

            if (!!selElmnt.options[j].attributes['selected']) {
                c.setAttribute("class", "same-as-selected");
            }

            c.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        // console.log(s.getAttribute('name'), $(`select[name='${s.getAttribute('name')}']`))
                        // if (s.getAttribute('name')) $(`select[name='${s.getAttribute('name')}']`).val(i);

                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");

                        for (j = 0; j < s.options.length; j++) {
                            s.options[j].removeAttribute('selected');
                        }

                        s.options[i].setAttribute('selected', 'selected');

                        break;
                    }
                }
                h.click();
            });
            d.appendChild(c);
        }
        x[i].appendChild(b).appendChild(d);
        a.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("active");
            $(this.nextSibling).removeClass("select-reverse");
            $(this).removeAttr("style");
            if ($(this).offset().top + this.nextSibling.offsetHeight > $(document).scrollTop() + $(window).height()) {
                $(this).css('border-radius','0 0 0.5rem 0.5rem');

                $(this.nextSibling).addClass("select-reverse");
                //this.classList.toggle("active-reverse");
            }
            //330px
        });
    }

    function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("active");
                y[i].classList.remove("active-reverse");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
});