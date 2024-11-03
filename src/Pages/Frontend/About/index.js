import React from 'react';
import { Card, Row, Col } from 'antd';

const aboutData = [
  {
    title: 'Our Mission',
    content: 'To empower students worldwide to achieve academic excellence through collaborative and innovative study tools.',
    image: 'https://via.placeholder.com/300x200.png?text=Our+Mission',
  },
  {
    title: 'Our Vision',
    content: 'To be the leading platform for students to collaborate, share knowledge, and grow together, paving the way for future leaders.',
    image: 'https://via.placeholder.com/300x200.png?text=Our+Vision',
  },
  {
    title: 'Our Team',
    content: 'We are a group of passionate educators, developers, and designers committed to revolutionizing the way students learn and interact.',
    image: 'https://via.placeholder.com/300x200.png?text=Our+Team',
  },
];

export default function About() {
  return (
    <main>
      <div style={{ padding: '50px' }}>
        <h1>About Us</h1>
        <Row gutter={[16, 16]}>
          {aboutData.map((item, index) => (
            <Col span={8} key={index}>
              <Card
                hoverable
                cover={<img alt={item.title} src={item.image} />}
              >
                <Card.Meta title={item.title} description={item.content} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </main>
  );
}
