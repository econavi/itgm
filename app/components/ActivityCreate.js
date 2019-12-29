import React, { useEffect } from 'react'

import { List, Icon, Button, Typography, Form, Input, Select } from 'antd'

const { Title } = Typography

import './Heading/Heading.css'

import useStoreon from 'storeon/react'

import { GET_LIST } from '../store/community'
import { CREATE } from '../store/activity'

const AcivityCreateForm = ({ form, user, community, onCreateActivity }) => {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue } = form

  const _handleSubmit = e => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        onCreateActivity(values)
      }
    })
  }

  return (
    <Form
      className="form form_view_profile"
      layout="vertical"
      onSubmit={_handleSubmit}
    >
      <div className="form__header">
        <Title className="heading heading_level_1">Добавление новой темы</Title>
      </div>
      <Form.Item label="Название">
        {getFieldDecorator('name', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'Это поле обязательно ¯\\_(ツ)_/¯'
            }
          ]
        })(<Input placeholder="Введите название темы" autoFocus />)}
      </Form.Item>
      <Form.Item label="Описание темы">
        {getFieldDecorator('description', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'Это поле обязательно ¯\\_(ツ)_/¯'
            }
          ]
        })(
          <Input.TextArea
            rows={6}
            placeholder="Введите краткое описание темы"
          />
        )}
      </Form.Item>
      <Form.Item label="Cообщество">
        {getFieldDecorator('community', {
          initialValue:
            user && user.community && user.community.id
              ? user.community.id
              : '33e0bed1-9ac2-420a-9e4e-eeb05a96d464'
        })(
          <Select
            showSearch
            placeholder="Выберите сообщество из списка"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {!community.loading &&
              community.list.map(item => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                  <span style={{ color: '#9e9e9e' }}>
                    {' '}
                    — {item.description}
                  </span>
                </Select.Option>
              ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Метки">
        {getFieldDecorator('tags', {
          initialValue: []
        })(
          <Select
            mode="tags"
            placeholder="Добавьте метки"
            optionLabelProp="label"
          ></Select>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  )
}

const WrappedAcivityCreateForm = Form.create({ name: 'user_edit' })(
  AcivityCreateForm
)

const AcivityCreate = () => {
  const { user, community, dispatch } = useStoreon('user', 'community')

  useEffect(() => {
    dispatch(GET_LIST)
  }, [dispatch])

  const formatCommunity = key => {
    const _community = community.list.find(_ => _.id === key)

    return {
      id: _community.id,
      resourceType: 'Community'
    }
  }

  const onCreateActivity = newCommunity => {
    const newData = {
      ...newCommunity,
      community: formatCommunity(newCommunity.community),
      user: {
        id: user.id,
        resourceType: 'User'
      }
    }

    dispatch(CREATE, newData)
  }

  return (
    <div className="content">
      <WrappedAcivityCreateForm
        user={user}
        community={community}
        onCreateActivity={onCreateActivity}
      />
    </div>
  )
}

export default AcivityCreate
