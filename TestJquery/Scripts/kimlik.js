function Veriler() {
    var url = '/Kimliks/Veriler';
    $('table').html("");
    var thead = '<thead><tr><td>Seç</td><td>AD</td><td>Soyad</td><td>no</td></tr></thead>';
    $('table').append(thead);
    $.getJSON(url, function (data) {
        for (var item in data.Result) {
            var guncelle = '<button data-id='+data.Result[item].id+' class="btn btn-primary guncelle">Güncelle</button>';
            var checkbox = '<input type="checkbox" name="secilmis" value=' + data.Result[item].id + ' />';
            var deger = '<tbody><tr><td>' + checkbox + '</td><td>' + data.Result[item].ad + '</td><td>' + data.Result[item].soyad + '</td><td>' + data.Result[item].no + '</td> <td>' + guncelle + '</td></tr></tbody>';
            $('table').append(deger);
        }
    });
}

$(document).on("click", "#temizle", function () {
    $('table').html("");
});

$(document).on("click", "#yenile", function () {
    Veriler();
});

$(document).on("click", "#ekle", async function () {
    const { value: formValues } = await Swal.fire({
        title: 'Veri Ekle',
        showCancelButton: true,
        cancelButtonColor: '#d43f3a',
        cancelButtonText: "İptal",
        confirmButtonText: "Ekle",
        confirmButtonColor: '#337ab7',
        html:
            '<input id="ad" placeholder="Ad Giriniz" class="swal2-input">' +
            '<input id="soyad" placeholder="Soyad Giriniz" class="swal2-input">' +
            '<input id="no" placeholder="Telefon No Giriniz" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('ad').value,
                document.getElementById('soyad').value,
                document.getElementById('no').value
            ]
        }
    })

    $.ajax({

        url: '/Kimliks/EkleJson',
        type: 'Post',
        dataType: 'Json',
        data: { ad: formValues[0], soyad: formValues[1], no: formValues[2] },
        success: function (gelenDeg) {
            if (gelenDeg == '1') {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı',
                    text: 'Kayıt başarıyle eklendi.',
                })
                Veriler();
            }

            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Bir hata oluştu ve kayıt eklenemedi.',
                })
            }
        }
    });

});

$(document).on("click", "#sil", function () {
    Swal.fire({
        title: 'Silmek İstediğinize Emin misiniz?',
        text: "Silinen veriler tekrar geri getirelemeyektir.",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText:'İptal',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet, Sil!'
    }).then((result) => {
        if (result.value) {
            var data = [];
            var tr = [];
            var sayac = 0;
            $("input[name='secilmis']:checked").each(function () {
                data[sayac] = $(this).val();
                tr[sayac] = $(this).parent('td').parent('tr');
                sayac++;

            });
            $.ajax({
                url: '/Kimliks/SilJson',
                type: 'Post',
                dataType: 'Json',
                data: { "data": data },
                success: function (gelenDeg) {
                    if (gelenDeg == '1') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Silindi!',
                            text: 'Kayıtlar başarıyla Silindi.',
                        })
                        var sayac2 = 0;
                        $(tr).each(function () {
                            tr[sayac2].remove();
                            sayac2++;
                        })
                    }

                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hata!',
                            text: 'Bir hata oluştu ve kayıt silinemedi eklenemedi.',
                        })
                    }
                }
            })
        }
    })
});



$(document).on("click", ".guncelle", async function () {
    var id = $(this).attr('data-id');
    $.ajax({

        url: '/Kimliks/GuncelleJson',
        type: 'Post',
        dataType: 'Json',
        data: { 'id': id },
        success: async function (data) {
            const { value: formValues } = await Swal.fire({
                title: 'Veri Ekle',
                showCancelButton: true,
                cancelButtonColor: '#d43f3a',
                cancelButtonText: "İptal",
                confirmButtonText: "Ekle",
                confirmButtonColor: '#337ab7',
                html:
                    '<input id="ad" value=' + data.Result.ad + ' placeholder="Ad Giriniz" class="swal2-input">' +
                    '<input id="soyad" value=' + data.Result.soyad + ' placeholder="Soyad Giriniz" class="swal2-input">' +
                    '<input id="no" value=' + data.Result.no + ' placeholder="Telefon No Giriniz" class="swal2-input">',
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        document.getElementById('ad').value,
                        document.getElementById('soyad').value,
                        document.getElementById('no').value
                    ]
                }
            })

            $.ajax({

                url: '/Kimliks/Guncelle',
                type: 'Post',
                dataType: 'Json',
                data: { id: id, ad: formValues[0], soyad: formValues[1], no: formValues[2] },
                success: function (gelenDeg) {
                    if (gelenDeg == '1') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Başarılı',
                            text: 'Kayıt başarıyle Güncellendi.',
                        })
                        Veriler();
                    }

                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hata!',
                            text: 'Bir hata oluştu ve kayıt güncellenemedi.',
                        })
                    }
                }
            });
        }
    });
});