export function appendDefined(
    fd: FormData,
  obj: Record<string, any>,   // or just: obj: any
  ) {
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== '') fd.append(k, v as string | Blob)
    }
  }