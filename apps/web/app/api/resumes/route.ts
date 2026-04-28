import { NextResponse } from 'next/server'
import { resumeService } from '../../../backend/modules/resume/resume.service'
import { auth } from '@clerk/nextjs/server';


export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        const data = await request.json()
        if (!userId || !data.title) {
            console.log('[resumes POST] 400 entrada:', { userId, data })
            return NextResponse.json(
                { message: "nenhum dado foi enviado ou usuário invalido"},
                { status: 400 }
            )
        }

        const newCV = await resumeService.createResume(userId, data)
        if (!newCV.success) {
            console.log('[resumes POST] 400 service:', newCV.errorDesc)
            return NextResponse.json(
                {
                    message: "Erro: Campos inválidos falha ao tentar criar um curriculo",
                    errorS: newCV.errorDesc

                 },
                { status: 400 }
            )
        }
        return NextResponse.json(newCV)
        
    } catch (error) {
        console.error("Erro na roda POST api/resumes", error)
        return NextResponse.json(
            {
                message: "Falha ao criar curriculo"
                
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const { userId } = await auth()
        
        if (!userId) {
            return NextResponse.json(
                { message: "Erro usuário não está autenticado" },
                {status: 401}
            )
        }

        const allCVs = await resumeService.getAllMyResumes(userId)
        return NextResponse.json(allCVs)

    } catch (error) {
        console.error("Erro na rota GET api/resumes para buscar todos os curriculos", error)
        return NextResponse.json(
            {
                message: "Erro ao tentar fazer requisição"
            },
            {status:500}
        )
    }
}

