import Link  from "next/link"

export default function landingPage() {


    return (
        <div className="checkout-simulate-button-container flex justify-center items-center mt-32 flex-col gap-4" >
            <h1>Simulação PLano LP</h1>
            <div className="checkout-simulate-button flex justify-center ">
                <Link className="button-simulate-checkout p-4 bg-white text-slate-950"
                    href="/cadastro"
                > TESTE CHECKOUT
                </Link>
            </div>
        </div>
    )
}