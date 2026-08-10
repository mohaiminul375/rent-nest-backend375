import app from "./app"

const main = async () => {
    try {
         app.listen(5000,()=>{
            console.log(`rent-nest server running on port:${5000}`)
         })
    } catch (error) {

    }
}

main()