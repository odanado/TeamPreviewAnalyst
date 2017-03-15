import sys
import unittest

sys.path.append('../src')
from analyzer import Analyzer  # NOQA


class TestAnalyzer(unittest.TestCase):

    def test_analyzer(self):
        file_path = './test/sample.jpg'
        analyzer = Analyzer()
        analyzer(file_path)


if __name__ == '__main__':
    unittest.main()
