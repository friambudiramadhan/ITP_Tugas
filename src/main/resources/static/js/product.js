const MAIN = {
    init: () => {
        MAIN.UI.init()
        MAIN.EVENTS.init()
    },
    EVENTS: {
        init: () => {
            MAIN.EVENTS.GetSelectedProduct()
            MAIN.EVENTS.HiddenModal()
            MAIN.EVENTS.BtnSaveProduct()
            MAIN.EVENTS.BtnUpdateStock()
            MAIN.EVENTS.BtnSubmitUpdateStock()
        },
        OnChangeSelectProduct: () => {
            $('#productIdUpdate').on('change', async function(){
                const productId = parseInt($(this).val()) || 0

                if(productId > 0) {
                    const fetchProduct = await MAIN.ENDPOINT.getProduct(productId)

                    if(!Array.isArray(fetchProduct) || (Array.isArray(fetchProduct) && (fetchProduct.length < 1))){
                        Swal.fire({
                            icon: 'error',
                            title: 'Produk tidak dapat ditemukan',
                        }).then(() => {
                            MAIN.UI.GenerateProductList()
                        })
                        return
                    }

                    const product = fetchProduct[0]
                    $('#StockUpdate').val(product.ProductStock)
                } else {
                    $('#StockUpdate').val(1)
                }
            })
        },
        GetSelectedProduct: () => {
            $('#cardContainer').delegate('.btn-action', 'click', async function(){
                const event = $(this).data('event')
                const productId = parseInt($(this).data('id'))

                if(event === 'edit'){
                    const fetchProduct = await MAIN.ENDPOINT.getProduct(productId)
                    if(!Array.isArray(fetchProduct) || (Array.isArray(fetchProduct) && (fetchProduct.length < 1))){
                        Swal.fire({
                            icon: 'error',
                            title: 'Produk tidak dapat ditemukan'
                        }).then(() => {
                            MAIN.UI.GenerateProductList()
                        })
                        return
                    }

                    const product = fetchProduct[0]

                    $('#productId').val(product.productId)
                    $('#ProductName').val(product.ProductName)
                    $('#ProductCode').val(product.ProductCode)
                    $('#ProductDescription').val(product.ProductDescription)
                    $('#ProductStock').val(product.ProductStock)
                    $('#ProductStockType').val(product.ProductStockType).trigger('change')
                    $('#ProductPrice').val(product.ProductPrice)

                    $('#btnSaveProduct').text('Perbarui')
                    $('#ProductStock').attr('disabled', true)

                    $('#modalProduct').modal('show')
                } else if(event === 'delete'){
                    Swal.fire({
                        icon: 'question',
                        title: 'Hapus Produk ?',
                        text: 'Aksi ini tidak bisa dibatalkan',
                        showCancelButton: true
                    }).then(async (res) => {
                        if(res.isConfirmed){
                            try{
                                const exec = await MAIN.ENDPOINT.deleteProduct(productId)
                                if(exec.StatusCode !== 200){
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Gagal hapus produk',
                                        text: exec.Message
                                    })
                                    return
                                }

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Berhasil',
                                    text: exec.Message
                                }).then(() => {
                                    MAIN.UI.GenerateProductList()
                                })
                            } catch(ex){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal hapus produk',
                                    text: ex.message
                                })
                                console.log(ex)
                            }
                        }
                    })
                }
            })
        },
        HiddenModal: () => {
            $('#modalProduct').on('hidden.bs.modal', function(){
                $('#productId').val(0)
                $('#ProductName').val('')
                $('#ProductCode').val('')
                $('#ProductDescription').val('')
                $('#ProductStock').val(0)
                $('#ProductStock').removeAttr('disabled')
                $('#ProductStockType').val('').trigger('change')
                $('#ProductPrice').val('')

                $('#btnSaveProduct').text('Simpan')
            })
        },
        BtnSaveProduct: () => {
            $('#btnSaveProduct').click(() => {
                const productId = parseInt($('#productId').val()) || 0
                const ProductName = $('#ProductName').val()
                const ProductCode = $('#ProductCode').val()
                const ProductDescription = $('#ProductDescription').val()
                const ProductStock = parseInt($('#ProductStock').val()) || 0
                const ProductStockType = parseInt($('#ProductStockType').val()) || 0
                const ProductPrice = parseInt($('#ProductPrice').val()) || 0

                if(!ProductName){
                    Swal.fire({
                        icon: 'info',
                        title: 'Nama Produk Kosong',
                        text: 'Nama produk tidak boleh kosong. Silahkan isi nama produk'
                    })
                    return
                } else if(ProductStockType < 1){
                    Swal.fire({
                        icon: 'info',
                        title: 'Tipe Stok Produk Kosong',
                        text: 'Tipe stok produk tidak boleh kosong. Silahkan isi tipe stok produk'
                    })
                    return
                } else if(ProductPrice < 1){
                    Swal.fire({
                        icon: 'info',
                        title: 'Harga Produk Kosong',
                        text: 'Harga produk tidak boleh kosong. Silahkan isi harga produk'
                    })
                    return
                }

                Swal.fire({
                    icon: 'question',
                    title: `${(productId > 0) ? 'Update' : 'Simpan'} Produk ?`,
                    text: 'Aksi ini tidak bisa dibatalkan',
                    showCancelButton: true
                }).then(async (res) => {
                    if(res.isConfirmed){
                        try{
                            const exec = await MAIN.ENDPOINT.SaveProduct(productId, ProductName, ProductCode, ProductDescription, ProductStock, ProductStockType, ProductPrice)
                            if(exec.StatusCode !== 200){
                                Swal.fire({
                                    icon: 'error',
                                    title: `Gagal {(productId > 0) ? 'Memperbarui' : 'Menyimpan'} Produk.`,
                                    text: exec.Message
                                })
                                return
                            }

                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: exec.Message
                            }).then(() => {
                                $('#modalProduct').modal('hide')
                                MAIN.UI.GenerateProductList()
                            })
                        } catch(ex){
                            Swal.fire({
                                icon: 'error',
                                title: `Gagal ${(productId > 0) ? 'Memperbarui' : 'Menyimpan'} Produk`,
                                text: ex.message
                            })
                            console.log(ex)
                            return
                        }
                    }
                })
            })
        },
        BtnUpdateStock: () => {
            $('#btnUpdateStock').click(() => {
                $('#modalUpdateStock').modal('show')
            })
        },
        BtnSubmitUpdateStock: () => {
            $('#btnSubmitUpdateStock').click(() => {
                const productId = parseInt($('#productIdUpdate').val()) || 0
                const stock = parseInt($('#StockUpdate').val()) || 0

                if(productId < 1){
                    Swal.fire({
                        icon: 'info',
                        title: 'Produk Kosong',
                        text: 'Produk tidak boleh kosong. Silahkan pilih produk'
                    })
                    return
                }

                Swal.fire({
                    icon: 'question',
                    title: `Perbarui stock produk ?`,
                    text: 'Aksi ini tidak bisa dibatalkan',
                    showCancelButton: true
                }).then(async (res) => {
                    if(res.isConfirmed){
                        try{
                            const exec = await MAIN.ENDPOINT.UpdateStock(productId, stock)
                            if(exec.StatusCode !== 200){
                                Swal.fire({
                                    icon: 'error',
                                    title: `Gagal Memperbarui Stock Produk.`,
                                    text: exec.Message
                                })
                                return
                            }

                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: exec.Message
                            }).then(() => {
                                $('#productIdUpdate').val('').trigger('change')
                                $('#modalUpdateStock').modal('hide')
                                MAIN.UI.GenerateProductList()
                            })
                        } catch(ex){
                            Swal.fire({
                                icon: 'error',
                                title: `Gagal Memperbarui Stock Produk`,
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
            MAIN.UI.GenerateProductList()
            MAIN.UI.GenerateSelectProduct()
        },
        GenerateProductList: async () => {
            try{
                const fetch = await MAIN.ENDPOINT.getListProduct()
                let html = ''
                fetch.forEach((e, i) => {
                    html += `<div class="d-flex align-items-center gap-3 rounded p-3 rounded border">
                                 <img class="border-end" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYS7KEXYFAwqdRCW81e4DSR_nSLYSFStx1Q&usqp=CAU" width="240"/>
                                 <div class="d-flex flex-column align-items-start w-100">
                                     <h5 class="fw-bold ">${e.ProductName}</h5>
                                     <span style="font-size: 14px; color: #90A3BF;"><i>${e.ProductDescription}</i></span>
                                     <div class="d-flex flex-wrap gap-1 my-3">
                                         <span class="px-3 py-1 rounded border fw-bold" style="background-color: rgba(214, 228, 253, .21); font-size: 12px; color: #877E7E;">Code : ${e.ProductCode}</span>
                                         <span class="px-3 py-1 rounded border fw-bold" style="background-color: rgba(214, 228, 253, .21); font-size: 12px; color: #877E7E;">Stok : ${e.ProductStock || 0}</span>
                                     </div>
                                     <div class="d-flex flex-wrap justify-content-between align-items-center w-100">
                                         <h4 class="fw-bold" style="color: #3563E9;">Rp ${e.ProductPrice}</h4>
                                         <div class="d-flex flex-wrap gap-1">
                                             <button class="btn btn-sm btn-primary btn-action" data-id="${e.productId}" data-event="edit">Edit</button>
                                             <button class="btn btn-sm btn-secondary btn-action" data-id="${e.productId}" data-event="delete">Hapus</button>
                                         </div>
                                     </div>
                                 </div>
                             </div>`
                })

                $('#cardContainer').empty().html(html)
            } catch(ex){
                console.log(ex)
                console.log(ex.message)
            }
        },
        GenerateSelectProduct: async () => {
            try{
                const fetch = await MAIN.ENDPOINT.getListProduct()
                let html = '<option value="">Pilih Produk</option>'
                fetch.forEach((e, i) => {
                    html += `<option value="${e.productId}">${e.ProductName}</option>`
                })

                $('#productIdUpdate').empty().html(html)
                MAIN.EVENTS.OnChangeSelectProduct()
            } catch(ex){
                console.log(ex)
            }
        }
    },
    ENDPOINT: {
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
        SaveProduct: (productId, ProductName, ProductCode, ProductDescription, ProductStock, ProductStockType, ProductPrice) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Product/SaveProduct',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {productId, ProductName, ProductCode, ProductDescription, ProductStock, ProductStockType, ProductPrice},
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        },
        UpdateStock: (productId, stock) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Product/UpdateStock',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {productId, stock},
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