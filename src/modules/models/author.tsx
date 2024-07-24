export async function Author({ model }: { model: string }) {
  console.log(model, 'model')

  if (!model) return null

  const res: any[] = await fetch(
    'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models-new.json',
    {
      next: { revalidate: 3600 },
    },
  ).then((res) => res.json())

  const findModel = res.find((item) => item.name === model)

  if (!findModel) return null

  return (
    <p className="text-muted-foreground">
      Created by <b className="text-foreground">{findModel.author}</b>
    </p>
  )
}
