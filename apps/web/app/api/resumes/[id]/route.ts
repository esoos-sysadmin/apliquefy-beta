import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {resumeService} from '../../../../backend/modules/resume/resume.service'

export async function GET(resquest: Request, contextDocmentId: { params: Promise<{ id: string }> }) {
    
    try {
        const { userId } = await auth()
        
        if (!userId) {
            return NextResponse.json({
                message: "Usuário não autenticado ou sem permissão"
            },
            {status: 401 }
        )
    }
        const {id} = await contextDocmentId.params
        
        if (!id) {
            return NextResponse.json({
                message: "Parametro da requisição inválidos ou faltando"
            },
                { status: 404 }
            )
        }

        const searchCVs = await resumeService.SearchMyCVsById(userId, id)

        if (searchCVs.success != true) {
           return NextResponse.json({
                message: "Erro ao tentar buscar o curriculo",
                ErrorDesc: searchCVs.errorDesc
            }, {status: 400})
        }

        return NextResponse.json(searchCVs, {status: 200})

    } catch (error) {
        console.error("error ao tentar acessar a rota GET /api/resumes/[id]:", error)
        return NextResponse.json({
            message: "erro no servidor ao tentar fazer requisição",
            errorDesc: error
        },
            { status: 500 }
        )
    }
    
}

export async function DELETE(request: Request, resumeId: { params: Promise<{id: string}>}) {
    try {
        const { userId } = await auth()
        
        if (!userId) {
            return NextResponse.json(
                { message: "erro na autenticação ou usuário não existe no banco de dados" },
                {status: 401}
            )
        }

        const {id} = await resumeId.params

        const deleteResume = await resumeService.deleteMyResume(userId, id)

        if (deleteResume.success != true) {
            return NextResponse.json(
                {
                    message: deleteResume.message ?? "Erro ao tentar deletar o curriculo",
                    errorDesc: deleteResume.errorDesc
                 },
                {status: 400}
            )
        }

        return NextResponse.json(

            {
                message: deleteResume.message
            }, {status: 200}
        )

    } catch (error) {
        console.error("Erro no rota DELETE api/resumes", error)
        return NextResponse.json(
            {
                message: "Erro ao tentar fazer a requisição"
            },
            {status: 500}
        )
    }
}

export async function PUT (request: Request, resumeId: {params: Promise<{id: string}>}) {
   
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            {
                message: "Erro usuário não autenticado"
            },
            {status: 401}
        )
    }
    
    const resumeUpdateJson = await request.json();
    
    const { id } =  await resumeId.params;

    if (!resumeUpdateJson || !id) {
        return NextResponse.json({
            message: "Erro dados incompletos ou inválidos, verifique os dados e tente novamente!"
        },
        {status:400}
        )
    }

    const updateCv = await resumeService.updateResume(userId, id, resumeUpdateJson);

    if (!updateCv.success) {
        console.error("[PUT /api/resumes] Zod validation failed:", JSON.stringify(updateCv.errorDesc, null, 2));
        return NextResponse.json({
            message: updateCv.message,
            error: updateCv.errorDesc
        },
        {status: 400})
    }

    return NextResponse.json({
        success: updateCv.success,
        data: updateCv.data
    })


}
