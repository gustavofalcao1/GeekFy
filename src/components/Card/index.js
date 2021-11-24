import React, { useRef, useContext } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import Boardcontext from '../Board/context'

import { Container, Label} from './styles'

export default function Card({ data, index, listIndex }) {
  const ref = useRef()
  const { move } = useContext(Boardcontext)

  const [{ isDragging }, dragRef] = useDrag({ 
    type: 'CARD', 
    item: {index, listIndex},
    collect: monitor => ({ 
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex
      const targetListIndex = listIndex

      const draggedIndex = item.index
      const targetIndex = index

      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return
      }
      
      const targetSize = ref.current.getBoundingClientRect()
      const targetCenter = (targetSize.bottom - targetSize.top) / 2
      
      
      const draggedOffset = monitor.getClientOffset()
      const draggedTop = draggedOffset.y - targetSize.top

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex)

      item.index = targetIndex
      index = draggedIndex
      item.listIndex = targetListIndex

      console.log('OK')
    }
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => 
          <Label key={label} color={label} />
        )}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt='Avatar User' />}
    </Container>
  )
}
