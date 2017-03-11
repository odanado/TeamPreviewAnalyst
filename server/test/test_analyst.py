import sys
import unittest

sys.path.append('../src')
from analyst import Analyst  # NOQA


class TestAnalyst(unittest.TestCase):

    def test_analyst(self):
        file_path = './test/sample.jpg'
        analyst = Analyst()
        analyst(file_path)


if __name__ == '__main__':
    unittest.main()
