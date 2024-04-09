
#include <vector>
struct Section
{
    float m_fx;
    float m_fy;
};
class Snake
{
private:
    std::vector<Section> m_stlbody;
public:
    Snake();
    void Update(double delta);
    const std::vector<Section>& GetBody() const;
};
Snake::Snake()
{
    m_stlbody.push_back((Section){1.f,0.f});
    m_stlbody.push_back((Section){-1.f,0.f});
}
void Snake::Update(double delta)
{
    for (std::vector<Section>::reverse_iterator riter = m_stlbody.rbegin();
         riter != m_stlbody.rend(); ++riter)
    {
        std::vector<Section>::reverse_iterator riternext = riter+1;
        if(riternext != m_stlbody.rend())
        {
            *riter = *riternext;
        }
    }
    Section* pSection = &m_stlbody.at(0);
    pSection->m_fx+=0.01f;
}
const std::vector<Section>& Snake::GetBody() const
{
    return m_stlbody;
}


int main()
{
    Snake s;
    s.Update(1/60.0);
    s.Update(1/60.0);
    const std::vector<Section>& stl_body = s.GetBody();
    for (const Section& secs : stl_body)
    {
        printf("%f:%f\n",secs.m_fx,secs.m_fy);
    }
}
