var FORMATTER = {
    rowNumber: (value, row, index) => {
        return index + 1
    },
    buttons: () => {
        return {
            btnRefresh: {
                text: 'Perbarui Data',
                icon: 'bi bi-arrow-clockwise',
                event: () => {
                    MAIN.UI.GenerateTransactionList()
                }
            }
        }
    }
}

const MAIN = {
    init: () => {
        MAIN.UI.init()
        MAIN.EVENTS.init()
    },
    EVENTS: {
        init: () => {
            MAIN.EVENTS.HiddenModal()
            MAIN.EVENTS.KeyUpQuantity()
            MAIN.EVENTS.BtnSaveTransaction()
        },
        OnChangeSelectProduct: () => {
            $('#productId').on('change', async function(){
                const productId = parseInt($(this).val()) || 0

                if(productId > 0){
                    const fetchProduct = await MAIN.ENDPOINT.getProduct(productId)
                    if(!Array.isArray(fetchProduct) || (Array.isArray(fetchProduct) && (fetchProduct.length < 1))){
                        Swal.fire({
                            icon: 'error',
                            title: 'Detail produk tidak dapat ditemukan',
                            text: exec.Message
                        })
                        return
                    }

                    const product = fetchProduct[0]

                    $('#ProductCode').val(product.ProductCode)
                    $('#StockType').val(product.ProductStockType).trigger('change')
                    $('#Quantity').val(1).trigger('change')
                    $('#Price').val(product.ProductPrice)
                    $('#TotalPrice').text(product.ProductPrice * 1)
                } else {
                    $('#ProductCode').val('')
                    $('#StockType').val(null).trigger('change')
                    $('#Quantity').val(1).trigger('change')
                    $('#Price').val(0)
                    $('#TotalPrice').text(0)
                }
            })
        },
        KeyUpQuantity: () => {
            $('#Quantity').on('keyup mouseup', function(){
                const Quantity = parseInt($(this).val()) || 1
                const Price = parseInt($('#Price').val()) || 0

                const times = Quantity * Price
                $('#TotalPrice').text(times)
            })
        },
        HiddenModal: () => {
            $('#modalTransaction').on('hidden.bs.modal', function(){
                $('#CustomerName').val('')
                $('#productId').val(1).trigger('change')
                $('#ProductCode').val('')
                $('#StockType').val(1).trigger('change')
                $('#Quantity').val(1)
                $('#Price').val('')
                $('#TotalPrice').text(0)

                $('#btnSaveTransaction').text('Simpan')
            })
        },
        BtnSaveTransaction: () => {
            $('#btnSaveTransaction').click(() => {
                const CustomerName = $('#CustomerName').val()
                const productId = parseInt($('#productId').val()) || 0
                const ProductName = $('#productId option:selected').text()
                const ProductCode = $('#ProductCode').val()
                const StockType = parseInt($('#StockType').val()) || 0
                const Quantity = parseInt($('#Quantity').val()) || 0
                const Price = parseInt($('#Price').val()) || 0
                const TotalPrice = parseInt($('#TotalPrice').text()) || 0

                if(!CustomerName){
                    Swal.fire({
                        icon: 'info',
                        title: 'Nama Customer Kosong',
                        text: 'Nama Customer tidak boleh kosong. Silahkan isi Customer produk'
                    })
                    return
                } else if(productId < 1){
                    Swal.fire({
                        icon: 'info',
                        title: ' Produk Kosong',
                        text: 'Produk tidak boleh kosong. Silahkan pilih produk'
                    })
                    return
                }

                const data = {CustomerName, productId, ProductName, ProductCode, StockType, Quantity, Price, TotalPrice}

                Swal.fire({
                    icon: 'question',
                    title: `Simpan Transaksi?`,
                    text: 'Aksi ini tidak bisa dibatalkan',
                    showCancelButton: true
                }).then(async (res) => {
                    if(res.isConfirmed){
                        try{
                            const exec = await MAIN.ENDPOINT.SaveTransaction(CustomerName, productId, ProductName, ProductCode, StockType, Quantity, Price, TotalPrice)
                            if(exec.StatusCode !== 200){
                                Swal.fire({
                                    icon: 'error',
                                    title: `Gagal menyimpan transaksi.`,
                                    text: exec.Message
                                })
                                return
                            }

                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: exec.Message
                            }).then(() => {
                                $('#modalTransaction').modal('hide')
                                MAIN.UI.GenerateTransactionList()
                            })
                        } catch(ex){
                            Swal.fire({
                                icon: 'error',
                                title: `Gagal menyimpan transaksi.`,
                                text: ex.message
                            })
                            console.log(ex)
                            return
                        }
                    }
                })
            })
        }
    },
    UI: {
        init: () => {
            MAIN.UI.GenerateTransactionList()
            MAIN.UI.GenerateSelectProduct()
        },
        GenerateTransactionList: async () => {
            try{
                const fetch = await MAIN.ENDPOINT.getListTransaction()

                $('#tblTransaction').bootstrapTable('destroy').bootstrapTable({
                    data: fetch
                })
            } catch(ex){
                console.log(ex)
            }
        },
        GenerateSelectProduct: async () => {
            try{
                const fetchProduct = await MAIN.ENDPOINT.getListProduct()
                let html = '<option value="">Pilih Produk</option>'
                fetchProduct.forEach((e, i) => {
                    html += `<option value="${e.productId}">${e.ProductName}</option>`
                })

                $('#productId').empty().html(html)
                MAIN.EVENTS.OnChangeSelectProduct()
            } catch(ex) {
                console.log(ex)
            }
        }
    },
    ENDPOINT: {
        getListTransaction: () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Transaction/GetListTransaction',
                    type: 'GET',
                    dataType: 'JSON',
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        },
        getListProduct: () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Product/GetListProduct',
                    type: 'GET',
                    dataType: 'JSON',
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        },
        getProduct: (productId) => {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: 'http://localhost:8080/Product/GetProduct',
                            type: 'POST',
                            dataType: 'JSON',
                            data: {productId},
                            success: (result) => resolve(result),
                            error: (err) => reject(err)
                        })
                    })
                },
        SaveTransaction: (CustomerName, productId, ProductName, ProductCode, StockType, Quantity, Price, TotalPrice) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Transaction/SaveTransaction',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {CustomerName, productId, ProductName, ProductCode, StockType, Quantity, Price, TotalPrice},
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        },
        deleteProduct: (productId) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Product/DeleteProduct',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {productId},
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        }
    }
}

MAIN.init()