import fastify from "fastify";
import {z} from 'zod'
import {PrismaClient} from "@prisma/client"
import { generateSlug } from "./utils/generate-slug";

const app = fastify()

//para criar a conexão com o banco de dados
const prisma = new PrismaClient({
  //cada query que for feita ao BD, será gerado um log
  log:['query']
})

//cada app.get é uma rota diferente 

app.post('/events', async (request, reply) => {
  //para ver o que está chegando até o backend
  //console.log(request.body)

  //validação
  const createEventSchema =z.object({
    title: z.string().min(4), //o titulo do evento deve ter no minimo 4 caracteres
    details: z.string().nullable(),//pode ser nulo
    maximumAttendees: z.number().int().positive().nullable() //precisa ser inteiro, positivo e pode ser nulo
  })

  //para verificar se está seguindo a validação criada acima
  const data = createEventSchema.parse(request.body)

  //para gerar a slug do evento já formatada para ser usada na URL
  const slug = generateSlug(data.title)

  //para verificar se já não há uma slug igual cadastrada no BD

  //para enviar essas informações para o bando de dados
  const event = await prisma.event.create({
    data :{
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: slug
    }
  })

  // return {eventID : event.id}
  //para retornar o status de criado
  return reply.status(201).send({eventID : event.id})
})


app.listen({port:3333}).then(() => {
  console.log("server is running on port 3333")
})